<template>
  <div class="calendar-view">
    <div class="card">
      <div class="header">
        <h2>{{ calendarTitle }}</h2>
        <div class="actions">
          <button 
            class="btn btn-success" 
            v-if="isLoggedIn" 
            @click="openModal()"
          >
            <i class="fas fa-plus"></i> Yeni Olay Ekle
          </button>
          <button 
            class="btn btn-primary" 
            @click="downloadICS()"
          >
            <i class="fas fa-download"></i> ICS Formatında İndir
          </button>
          <button 
            class="btn btn-secondary" 
            @click="downloadCSV()"
          >
            <i class="fas fa-download"></i> CSV Formatında İndir
          </button>
        </div>
      </div>

      <div class="calendar-table">
        <table>
          <thead>
            <tr>
              <th>AKADEMİK OLAY</th>
              <th colspan="2">GÜZ YARIYILI</th>
              <th colspan="2">BAHAR YARIYILI</th>
              <th>İşlemler</th>
            </tr>
            <tr>
              <th></th>
              <th>Tarih</th>
              <th>Bitiş</th>
              <th>Tarih</th>
              <th>Bitiş</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(event, index) in events" :key="index">
              <td>{{ event.name }}</td>
              <td>{{ event.fallStart.split('T')[0] }}</td>
              <td>{{ event.fallEnd.split('T')[0] }}</td>
              <td>{{ event.springStart.split('T')[0] }}</td>
              <td>{{ event.springEnd.split('T')[0] }}</td>
              <td>
                <div class="action-buttons" v-if="isLoggedIn">
                  <button 
                    class="btn btn-edit" 
                    @click="editEvent(index)" 
                    title="Düzenle"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    class="btn btn-delete" 
                    @click="confirmDelete(index)" 
                    title="Sil"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ isEditing ? 'Olayı Düzenle' : 'Yeni Olay Ekle' }}</h3>
            <button class="close-button" @click="closeModal">&times;</button>
          </div>
          <form @submit.prevent="saveEvent" class="event-form">
            <div class="form-group">
              <label for="name">Olay Adı:</label>
              <input 
                v-model="currentEvent.name" 
                type="text" 
                id="name" 
                class="form-control" 
                required 
                placeholder="Olay adını giriniz"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <h4>Güz Yarıyılı</h4>
                <div class="date-group">
                  <div>
                    <label for="fallStart">Başlangıç Tarihi:</label>
                    <input 
                      v-model="currentEvent.fallStart" 
                      type="date" 
                      id="fallStart" 
                      class="form-control"
                    />
                  </div>
                  <div>
                    <label for="fallEnd">Bitiş Tarihi:</label>
                    <input 
                      v-model="currentEvent.fallEnd" 
                      type="date" 
                      id="fallEnd" 
                      class="form-control"
                    />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <h4>Bahar Yarıyılı</h4>
                <div class="date-group">
                  <div>
                    <label for="springStart">Başlangıç Tarihi:</label>
                    <input 
                      v-model="currentEvent.springStart" 
                      type="date" 
                      id="springStart" 
                      class="form-control"
                    />
                  </div>
                  <div>
                    <label for="springEnd">Bitiş Tarihi:</label>
                    <input 
                      v-model="currentEvent.springEnd" 
                      type="date" 
                      id="springEnd" 
                      class="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="closeModal">İptal</button>
              <button type="submit" class="btn btn-success">
                {{ isEditing ? 'Güncelle' : 'Ekle' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
  name: 'CalendarView',
  setup() {
    const route = useRoute();
    const calendarId = route.params.id;
    const calendarTitle = ref('');
    const events = ref([]);
    const isLoggedIn = ref(false);

    const checkLoginStatus = () => {
      isLoggedIn.value = localStorage.getItem("token") !== null;
    };

    const getCalendarTitle = (id) => {
      const titles = {
        '1': 'Lisans Önlisans Akademik Takvimi',
        '2': 'Yüksek Lisans Akademik Takvimi',
        '3': 'Doktora Akademik Takvimi'
      };
      return titles[id] || 'Akademik Takvim';
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/events/calendar/${calendarId}`);
        events.value = response.data.data.map(event => ({
          _id: event._id,
          name: event.title,
          fallStart: event.fallStartDate,
          fallEnd: event.fallEndDate,
          springStart: event.springStartDate,
          springEnd: event.springEndDate,
        }));
      } catch (error) {
        console.error("Olaylar alınırken hata oluştu:", error);
      }
    };

    onMounted(() => {
      checkLoginStatus();
      calendarTitle.value = getCalendarTitle(calendarId);
      fetchEvents();
    });

    const downloadICS = () => {
      let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\n";
      events.value.forEach((event) => {
        icsContent += `BEGIN:VEVENT\nSUMMARY:${event.name}\n`;
        if (event.fallStart) icsContent += `DTSTART:${event.fallStart.replace(/-/g, '')}T000000Z\n`;
        if (event.fallEnd) icsContent += `DTEND:${event.fallEnd.replace(/-/g, '')}T000000Z\n`;
        icsContent += `END:VEVENT\n`;
      });
      icsContent += "END:VCALENDAR";
      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "akademik_takvim.ics";
      link.click();
    };

    const downloadCSV = () => {
      const csvHeaders = "AKADEMİK OLAY, GÜZ BAŞLANGIÇ, GÜZ BİTİŞ, BAHAR BAŞLANGIÇ, BAHAR BİTİŞ\n";
      const csvRows = events.value
        .map(
          (event) =>
            `"${event.name}","${event.fallStart || ""}","${event.fallEnd || ""}","${event.springStart || ""}","${event.springEnd || ""}"`
        )
        .join("\n");
      const csvContent = csvHeaders + csvRows;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "akademik_takvim.csv";
      link.click();
    };

    return {
      events,
      isLoggedIn,
      calendarTitle,
      fetchEvents,
      downloadICS,
      downloadCSV,
    };
  },
};
</script>


<style scoped>
.calendar-view {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  margin: 0;
}

.actions {
  display: flex;
  gap: 1rem;
}

.calendar-table {
  margin: 2rem 0;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f5f5f5;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #b02a37;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-edit {
  background-color: #ffc107;
  color: #000;
  padding: 0.5rem;
  margin-right: 0.5rem;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  padding: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.event-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.date-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-control {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.form-control:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

h4 {
  margin: 0;
  color: #495057;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
</style>
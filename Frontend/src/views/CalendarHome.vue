<template>
  <div class="home">
    <div class="container">
      <h1 class="page-title">Akademik Takvimler</h1>

      <button 
        v-if="isLoggedIn" 
        @click="showAddCalendarModal" 
        class="btn btn-primary caledar-add-btn"
      >
        Takvim Ekle
      </button>

      <div class="calendar-list">
        <div
          v-for="calendar in calendars"
          :key="calendar.id"
          class="calendar-item"
        >
          <div class="calendar-info">
            <h3>{{ calendar.name }}</h3>
            <span class="year">{{ calendar.year }}</span>
          </div>
          <div class="calendar-actions">
            <router-link
              :to="{ name: 'CalendarView', params: { id: calendar.id }}"
              class="btn btn-primary" style="text-decoration: none;"
            >
              <i class="fas fa-calendar-alt"></i> Görüntüle
            </router-link>
            <button
              v-if="isLoggedIn"
              @click="deleteCalendar(calendar.id)"
              class="btn btn-secondary"
            >
              <i class="fas fa-trash-alt"></i> Sil
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal">
        <h2>Takvim Ekle</h2>
        <form @submit.prevent="addCalendar">
          <label for="name">Takvim Adı</label>
          <input v-model="newCalendar.name" type="text" id="name" required />

          <label for="startDate">Başlangıç Tarihi</label>
          <input
            v-model="newCalendar.startDate"
            type="date"
            id="startDate"
            required
          />

          <label for="endDate">Bitiş Tarihi</label>
          <input
            v-model="newCalendar.endDate"
            type="date"
            id="endDate"
            required
          />

          <button type="submit" class="btn btn-primary">Kaydet</button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="closeModal"
          >
            İptal
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CalendarHome",
  data() {
    return {
      calendars: [],
      isModalOpen: false, 
      isLoggedIn: false, 
      newCalendar: {
        name: "",
        startDate: "",
        endDate: ""
      }
    };
  },
  methods: {
    showAddCalendarModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.newCalendar = {
        name: "",
        startDate: "",
        endDate: ""
      };
    },
    async addCalendar() {
      try {
        const response = await axios.post("http://localhost:3000/api/calendars", {
          name: this.newCalendar.name,
          startDate: new Date(this.newCalendar.startDate).toISOString(),
          endDate: new Date(this.newCalendar.endDate).toISOString(),
          createdBy: "Pelin Üstünel"
        });

        if (response.data.success) {
          const addedCalendar = response.data.data;
          this.calendars.push({
            id: addedCalendar._id,
            name: addedCalendar.name,
            year: `${new Date(addedCalendar.startDate).getFullYear()}-${new Date(
              addedCalendar.endDate
            ).getFullYear()}`
          });

          this.closeModal();
        }
      } catch (error) {
        console.error("Takvim eklenirken bir hata oluştu:", error);
      }
    },
    async fetchCalendars() {
      try {
        const response = await axios.get("http://localhost:3000/api/calendars");
        if (response.data.success) {
          this.calendars = response.data.data.map(calendar => ({
            id: calendar._id,
            name: calendar.name,
            year: `${new Date(calendar.startDate).getFullYear()}-${new Date(
              calendar.endDate
            ).getFullYear()}`
          }));
        }
      } catch (error) {
        console.error("Takvimler alınırken bir hata oluştu:", error);
      }
    },
    async deleteCalendar(calendarId) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/calendars/${calendarId}`);
        if (response.data.success) {
          this.calendars = this.calendars.filter(calendar => calendar.id !== calendarId);
        }
      } catch (error) {
        console.error("Takvim silinirken bir hata oluştu:", error);
      }
    },
    checkLoginStatus() {
      this.isLoggedIn = localStorage.getItem("token") !== null;
    }
  },
  mounted() {
    this.checkLoginStatus();
    this.fetchCalendars(); 
  }
};
</script>


<style scoped>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9fafb; 
  color: #333;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.calendar-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.calendar-item {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.calendar-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.calendar-info h3 {
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 0.5rem;
}
.caledar-add-btn{
  margin-bottom: 1rem;
}
.calendar-info .year {
  font-size: 1rem;
  color: #7f8c8d;
}

.calendar-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem; 
}


.calendar-actions .btn {
  padding: 0.75rem 1.5rem; 
  border-radius: 10px; 
  border: none;
  font-size: 1rem;
  background-color: white !important;
  font-weight: bold; 
  cursor: pointer;
  transition: all 0.3s ease; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
}

.calendar-actions .btn-primary {
  background: linear-gradient(135deg, #ccc, #3498db); 
  color: white;
}

.calendar-actions .btn-primary:hover {
  background-color: #2980b9;
  color: white !important;

}

.calendar-actions .btn-secondary {
  background: linear-gradient(135deg, #ccc, #3498db); 
  color: white !important;

}

.calendar-actions .btn-secondary:hover {
  background: linear-gradient(135deg, #ccc, #3498db); 
  transform: translateY(-3px);
  
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, #ccc, #3498db); 
  color: white;
  border: none;
  padding: 1rem 2rem; 
  border-radius: 15px;
  font-size: 1.5rem;
  font-weight: bold;
  display: block;
  cursor: pointer;
  transition: all 0.3s ease; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #ccc, #3498db); 
  transform: scale(1.05);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 90%;
}
.modal form .btn-primary,
.modal form .btn-secondary {
  display: inline-block;
  width: auto; 
  margin-right: 1rem; 
}
.modal form .btn-secondary {
  background-color: white;
  color: white; 
  border: 1px solid #ccc; 
}

.modal h2 {
  font-size: 1.75rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}

.modal form label {
  display: block;
  font-size: 1rem;
  color: #34495e;
  margin-bottom: 0.5rem;
}

.modal form input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.modal form button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
}

.modal form .btn-primary {
  background: linear-gradient(135deg, #ccc, #3498db); 
  font-size: 1.25rem; 
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  margin-top: 1rem;
}

.modal form .btn-secondary {
  background: linear-gradient(135deg, #ccc, #3498db); 
  font-size: 1.25rem; 
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .calendar-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .calendar-actions .btn {
    width: 100%;
  }
}
</style>


// import axios from "axios";
// import { testAlert } from './sweetAlert';

const login = async (email, password) => {  
  console.log(email + " " + password);
try {
  
    const res = await axios({
      method: 'POST',
      url: '/auth/loginpost',
      data: {
        email,
        password
      }
    }); 
  console.log(res);
  if (res.data.status === 'success') {
    alert('Logged in successfully');
    window.setTimeout(() => {
      location.assign('/dashboard/products')
    },1500)
  }
  } catch(err) {
  alert(err.response.data.message)
  }
};     
const loginForm = document.querySelector('.loginForm');
if (loginForm) {
  document.querySelector('.loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Hello from login form');
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
})
}

// console.log("FFSDFSD");
const logout = async () => {  
  
try {
  
    const res = await axios({
      method: 'GET',
      url: '/auth/logout',
      
    }); 
  console.log(res);
  if (res.data.status === 'success') location.assign('/auth/login')

  } catch(err) {
  alert(err.response.data.message)
  }
};     

const logoutBtn = document.getElementById('logoutcLICK');

if (logoutBtn) logoutBtn.addEventListener('click', logout)
  


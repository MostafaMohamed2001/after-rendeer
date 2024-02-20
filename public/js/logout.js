const logout = async () => {  
  
  try {
    
      const res = await axios({
        method: 'GET',
        url: '/auth/logout',
        
      }); 
    console.log(res);
    if (res.data.status === 'success') location.reload(true)
  
    } catch(err) {
    alert(err.response.data.message)
    }
  };     
  
  const logoutBtn = document.getElementById('logoutcLICK');
  console.log(logoutBtn);
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout)
  } else {
    console.log("not found")
  }
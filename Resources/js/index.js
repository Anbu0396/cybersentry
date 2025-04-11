  window.addEventListener("DOMContentLoaded", () => {
    fetch("/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          document.getElementById("greeting").textContent = `Hello!! ${data.username}!`;
          document.getElementById("greeting").style.display = "block";
          document.querySelector(".user-id").style.display = "none";
        } else {
          document.getElementById("greeting").style.display = "none";
          document.querySelector(".user-id").style.display = "flex";
        }
      });
  });

  const si = document.querySelector('.si');
  const su = document.querySelector('.su');
  const user=document.querySelector('.user-id')
  
  su.addEventListener('mouseover', () => {
  su.addEventListener('mouseout', () => {
      user.style.backgroundColor = '#ffbb00';
  });
  user.style.backgroundColor = '#6c7175';
});

si.addEventListener('mouseover', () => {
  si.addEventListener('mouseout', () => {
    user.style.backgroundColor = '#ffbb00';
  });
});
  

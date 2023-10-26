const register = async (name, email, password) => {
    try {
      const res = await axios({
        method: "POST",
        url: "/register",
        data: {
          name,
          email,
          password,
        },
      });
  
      console.log(res);
      window.location.href = "/login";
    } catch (err) {
      console.log(err);
    }
  };
  
  document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    await register(name, email, password);
  });
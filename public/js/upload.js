import ItemClass from "./itemClass.js";

const init = () => { 
  declareEvents();
}

const declareEvents = () => {
  const id_form = document.querySelector("#id_form");
  const id_file = document.querySelector("#id_file"); 
  const id_loading = document.querySelector("#id_loading");
  id_loading.style.display = "none";
  id_form.addEventListener("submit", async(e) => {
    e.preventDefault();
    try {
      console.log(id_file.files[0]);
      const form = new FormData();
      id_loading.style.display = "block";
      form.append("foo",id_file.files[0] )
      // const url = "http://localhost:3001/ai/image";
      const url = "https://ai-test-p4ph.onrender.com/ai/image";
      const resp = await axios({
        url:url,
        method:"POST",
        data:form
      })
      id_loading.style.display = "none";
      console.log(resp.data);
      createList(resp.data)
    } catch (error) {
      console.log(error);
    }
  

  })
}

const createList = (_ar) => {
  document.querySelector("#id_box").innerHTML = "";
  _ar.forEach(item => {
    const box = new ItemClass("#id_box",item)
  })
}

init();
const formulario = document.querySelector("#formulario-contacto");
const botonEnviar = document.querySelector(".btn-enviar");

const nameContact = document.getElementsByName("name_contact")[0];
const email = document.getElementsByName("email_contact")[0];
const phone = document.getElementsByName("phone_contact")[0];
const topic = document.getElementById("topic_contact");
const commit = document.getElementsByName("commit_contact")[0];

const errorsList = document.getElementById("errors");
const url = 'https://30kd6edtfc.execute-api.us-east-1.amazonaws.com/prod/send-email';

function showError(element, message) {
    element.classList.toggle("error");
    hasErrors = true;
    errorsList.innerHTML += `<li>${message}</li>`;
}

function cleanErrors() {
    errorsList.innerHTML = "";
    nameContact.classList.remove("error");
    email.classList.remove("error");
    phone.classList.remove("error");
    topic.classList.remove("error");
    commit.classList.remove("error");
}

const limpiarCampos = () => {
    nameContact.value = '';
    email.value = '';
    phone.value = '';
    commit.value = '';
}
const alerta = (icon = 'success', title) => {
    Swal.fire({
        position: 'top-end',
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: 1500
      })
}

const validaciones = {
  validaNombre: () => {
    if (!(nameContact.value != "" && nameContact.value.includes(" "))) {
      showError(nameContact,"nombre y apellido no debe estar vacío y contener al menos un espacio.");
      return true; // true es error;
    }
  },
  validaMail: () => {
    const mailRe = /^\w+@\w+\.\w{2,7}$/;
    if (!mailRe.exec(email.value)) {
      showError(email, "El correo debe seguir un formato válido.");
      return true; // true es error;
    }
  },
  validaPhone: () => {
    const phoneRe = /^\+?\d{7,15}$/;
    const sanitizedPhone = phone.value.replace(" ", "");
    if (!phoneRe.exec(sanitizedPhone)) {
      showError(phone, "Número de teléfono debe tener entre 7 y 15 dígitos.");
      return true;
    }
  },
  validaComentario: () => {
    if (commit.value.length < 20) {
      showError(commit, "Campo comentario debe tener al menos 20 caracteres.");
      return true; // true es error;
    }
  }
};

const Procesar = () =>{
    cleanErrors();
    let hasErrors = false;
    // TODO: validar nombre y apellido acá
    hasErrors = validaciones.validaNombre() === true ? true : hasErrors;
    hasErrors = validaciones.validaMail() === true ? true : hasErrors;
    hasErrors = validaciones.validaPhone() === true ? true : hasErrors;
    // TODO: Validar comentario acá
    hasErrors = validaciones.validaComentario() === true ? true : hasErrors;
    // TODO: Enviar consulta a API en caso de que el formulario esté correcto
    if (hasErrors) {
      alerta("warning", "No ha sido posible enviar la información");
      return;
    } else {
      //Enviar datos a API
      let Contacto = {
        name: nameContact.value,
        email: email.value,
        phone: phone.value,
        select: topic.value,
        comment: commit.value,
      };
      sendMail(url, Contacto);
    }
}
/*
URL API: https://30kd6edtfc.execute-api.us-east-1.amazonaws.com/prod/send-email
METHOD: POST
ESTRUCTURA BODY: {
	"name": "", 
	"email": "", 
	"phone": "",
	"select": "",
	"comment": ""
}
*/
//async function sendMail(name, email, phone, select, comment) {
    // TODO: Enviar datos a API usando fetch, siguiendo la estructura indicada
    const sendMail = async function(url, Contacto) {
        let {name, email, phone, select, comment} = Contacto;
        console.log('JSON:', JSON.stringify({name, email,phone,select,comment}))
        const respuesta = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept' : 'application/json',
                        'Content-Type' : 'application/json' 
                    },
                    body: JSON.stringify({name, email,phone,select,comment})
                });
        const result = await respuesta.json();
        if(Object.keys(result.errors).length === 0) {
            alerta("success", "Información enviada correctamente");
            limpiarCampos();
        }
        else{
            alerta("warning", "No ha sido posible enviar el mail");
            console.log(result.errors)
        }
        //result.results;
      };
    
    

/*
Validaciones necesarias:
+ Campo nombre y apellido no debe estar vacío y contener al menos un espacio
+ Campo correo debe tener un correo válido
+ Campo número de teléfono debe tener entre 7 y 15 dígitos, 
    pudiendo tener un + al inicio, ignorando espacios en blanco
+ Campo comentario debe tener al menos 20 caracteres
*/
botonEnviar.addEventListener("click", (event) => {
    console.log('ha sido click')
    event.preventDefault();
    Procesar();
});

// Desafío opcional: qué elemento y evento podríamos usar para detectar si el usuario apreta Enter en vez de hacer click?
formulario.addEventListener('keypress', function (e) {
    
    if (e.key === 'Enter' && e.target.name != 'commit_contact') {
        console.log('ha sido Enter', e.target.name)
        e.preventDefault();
        Procesar();
    }
});

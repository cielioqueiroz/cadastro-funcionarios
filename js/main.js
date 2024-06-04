document.addEventListener("DOMContentLoaded", function () {
  const currentYear = new Date().getFullYear();
  document.getElementById("current-year").innerText = currentYear;
});

const modal = document.querySelector(".modal-container");
const modalDelete = document.querySelector(".modal-container-delete");
const tbody = document.querySelector("tbody");
const sNome = document.querySelector("#m-nome");
const sFuncao = document.querySelector("#m-funcao");
const sSalario = document.querySelector("#m-salario");
const btnSalvar = document.querySelector("#btnSalvar");
const btnConfirmDelete = document.querySelector("#btnConfirmDelete");
const btnCancelDelete = document.querySelector("#btnCancelDelete");
const deleteMessage = document.querySelector("#delete-message");

let itens = getItensBD();
let id;
let deleteId;

function openModal(edit = false, index = 0) {
  modal.classList.add("active");

  modal.onclick = (e) => {
    if (e.target.className.indexOf("modal-container") !== -1) {
      modal.classList.remove("active");
    }
  };

  if (edit) {
    sNome.value = itens[index].nome;
    sFuncao.value = itens[index].funcao;
    sSalario.value = parseFloat(itens[index].salario).toFixed(2);
    id = index;
  } else {
    sNome.value = "";
    sFuncao.value = "";
    sSalario.value = "";
  }
}

function editItem(index) {
  openModal(true, index);
}

function deleteItem(index) {
  deleteId = index;
  deleteMessage.innerText = `Tem certeza que deseja excluir o(a) funcionário(a) ${itens[index].nome}?`;
  modalDelete.classList.add("active");

  modalDelete.onclick = (e) => {
    if (e.target.className.indexOf("modal-container-delete") !== -1) {
      modalDelete.classList.remove("active");
    }
  };
}

btnConfirmDelete.onclick = () => {
  const deletedName = itens[deleteId].nome;
  itens.splice(deleteId, 1);
  setItensBD();
  loadItens();
  modalDelete.classList.remove("active");
  Toastify({
    text: `Funcionário(a) ${deletedName} excluído(a) com sucesso`,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    backgroundColor: "#4CAF50"
  }).showToast();
};

btnCancelDelete.onclick = () => {
  modalDelete.classList.remove("active");
};

function insertItem(item, index) {
  let tr = document.createElement("tr");

  const salarioFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(item.salario);

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.funcao}</td>
    <td>${salarioFormatado}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

btnSalvar.onclick = (e) => {
  e.preventDefault();
  if (sNome.value === "" || sFuncao.value === "" || sSalario.value === "") {
    Toastify({
      text: "Por favor, preencha todos os campos!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#FF0000"
    }).showToast();
    return;
  }

  const salario = parseFloat(sSalario.value.replace(",", ".")).toFixed(2);

  if (id !== undefined) {
    itens[id].nome = sNome.value;
    itens[id].funcao = sFuncao.value;
    itens[id].salario = salario;
    Toastify({
      text: `Funcionário(a) ${itens[id].nome} editado(a) com sucesso`,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#4CAF50"
    }).showToast();
  } else {
    itens.push({
      nome: sNome.value,
      funcao: sFuncao.value,
      salario: salario,
    });
    Toastify({
      text: `Funcionário(a) ${sNome.value} incluído(a) com sucesso`,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#4CAF50"
    }).showToast();
  }

  setItensBD();
  loadItens();
  modal.classList.remove("active");
  id = undefined;
};

function loadItens() {
  itens = getItensBD();
  tbody.innerHTML = "";
  itens.forEach((item, index) => {
    insertItem(item, index);
  });
}

function getItensBD() {
  return JSON.parse(localStorage.getItem("dbfunc")) ?? [];
}

function setItensBD() {
  localStorage.setItem("dbfunc", JSON.stringify(itens));
}

loadItens();

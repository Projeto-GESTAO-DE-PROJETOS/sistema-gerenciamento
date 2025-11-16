// Dados simulados - substitua por chamadas a sua API/banco de dados
const consultasMock = [
  {
    id: 1,
    paciente: "João Silva",
    data: "2024-01-15",
    hora: "09:00",
    tipo: "fisioterapia",
    profissional: "Dr. João Silva",
    status: "agendada",
    observacoes: "Primeira consulta",
  },
  {
    id: 2,
    paciente: "Maria Santos",
    data: "2024-01-15",
    hora: "10:30",
    tipo: "massagem",
    profissional: "Dra. Maria Santos",
    status: "em-andamento",
    observacoes: "Acompanhamento",
  },
  {
    id: 3,
    paciente: "Pedro Costa",
    data: "2024-01-15",
    hora: "14:00",
    tipo: "reabilitacao",
    profissional: "Dr. Pedro Costa",
    status: "concluida",
    observacoes: "Sessão concluída",
  },
]

const pacientesMock = [
  { id: 1, nome: "João Silva", telefone: "(11) 98765-4321", email: "joao@email.com", diagnostico: "Lesão no joelho" },
  { id: 2, nome: "Maria Santos", telefone: "(11) 99876-5432", email: "maria@email.com", diagnostico: "Dor nas costas" },
  { id: 3, nome: "Pedro Costa", telefone: "(11) 97654-3210", email: "pedro@email.com", diagnostico: "Tendinite" },
  {
    id: 4,
    nome: "Ana Oliveira",
    telefone: "(11) 98765-1234",
    email: "ana@email.com",
    diagnostico: "Entorse de tornozelo",
  },
]

let consultas = [...consultasMock]
let editandoId = null

// DOM Elements
const modal = document.getElementById("modal")
const consultaForm = document.getElementById("consulta-form")
const btnNovo = document.getElementById("btn-novo")
const closeBtn = document.querySelector(".close-btn")
const tabBtns = document.querySelectorAll(".nav-btn")
const tabContents = document.querySelectorAll(".tab-content")
const pageTitle = document.getElementById("page-title")

// Event Listeners
btnNovo.addEventListener("click", abrirModal)
closeBtn.addEventListener("click", fecharModal)
consultaForm.addEventListener("submit", salvarConsulta)
document.querySelector(".btn-cancel").addEventListener("click", fecharModal)

// Tab Navigation
tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabName = btn.getAttribute("data-tab")
    alterarTab(tabName)
  })
})

// Modal Functions
function abrirModal(id = null) {
  editandoId = id
  const modalTitle = document.getElementById("modal-title")

  if (id) {
    const consulta = consultas.find((c) => c.id === id)
    modalTitle.textContent = "Editar Consulta"
    preencherFormulario(consulta)
  } else {
    modalTitle.textContent = "Nova Consulta"
    consultaForm.reset()
  }
  modal.classList.add("active")
}

function fecharModal() {
  modal.classList.remove("active")
  consultaForm.reset()
  editandoId = null
}

function preencherFormulario(consulta) {
  document.getElementById("paciente").value = consulta.paciente
  document.getElementById("data").value = consulta.data
  document.getElementById("hora").value = consulta.hora
  document.getElementById("tipo").value = consulta.tipo
  document.getElementById("profissional").value = consulta.profissional
  document.getElementById("status").value = consulta.status
  document.getElementById("observacoes").value = consulta.observacoes
}

function salvarConsulta(e) {
  e.preventDefault()

  const novaConsulta = {
    id: editandoId || Math.max(...consultas.map((c) => c.id), 0) + 1,
    paciente: document.getElementById("paciente").value,
    data: document.getElementById("data").value,
    hora: document.getElementById("hora").value,
    tipo: document.getElementById("tipo").value,
    profissional: document.getElementById("profissional").value,
    status: document.getElementById("status").value,
    observacoes: document.getElementById("observacoes").value,
  }

  if (editandoId) {
    const index = consultas.findIndex((c) => c.id === editandoId)
    consultas[index] = novaConsulta
  } else {
    consultas.push(novaConsulta)
  }

  fecharModal()
  renderizarConsultas()
}

// Tab Navigation
function alterarTab(tabName) {
  tabBtns.forEach((btn) => btn.classList.remove("active"))
  tabContents.forEach((content) => content.classList.remove("active"))

  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active")
  document.getElementById(tabName).classList.add("active")

  const titulos = {
    dashboard: "Dashboard",
    consultas: "Gerenciamento de Consultas",
    pacientes: "Pacientes",
    relatorios: "Relatórios",
  }
  pageTitle.textContent = titulos[tabName]

  if (tabName === "pacientes") renderizarPacientes()
  if (tabName === "relatorios") renderizarRelatorios()
  if (tabName === "dashboard") renderizarDashboard()
}

// Dashboard
function renderizarDashboard() {
  const hoje = new Date().toISOString().split("T")[0]
  const consultasHoje = consultas.filter((c) => c.data === hoje)
  const concluidas = consultas.filter((c) => c.status === "concluida").length
  const pendentes = consultas.filter((c) => c.status !== "concluida" && c.status !== "cancelada").length

  document.getElementById("consultas-hoje").textContent = consultasHoje.length
  document.getElementById("consultas-concluidas").textContent = concluidas
  document.getElementById("consultas-pendentes").textContent = pendentes
  document.getElementById("total-pacientes").textContent = pacientesMock.length

  const proximasConsultas = consultas
    .filter((c) => new Date(`${c.data}T${c.hora}`) >= new Date())
    .sort((a, b) => new Date(`${a.data}T${a.hora}`) - new Date(`${b.data}T${b.hora}`))
    .slice(0, 5)

  const agendaList = document.getElementById("proximas-consultas")
  agendaList.innerHTML =
    proximasConsultas
      .map(
        (c) => `
        <div class="agenda-item">
            <div class="agenda-item-info">
                <div class="agenda-item-time">${c.hora}</div>
                <div class="agenda-item-patient">${c.paciente}</div>
                <div class="agenda-item-type">${c.tipo} - ${c.profissional}</div>
            </div>
            <span class="status-badge status-${c.status.replace(/\s+/g, "-")}">${c.status}</span>
        </div>
    `,
      )
      .join("") || "<p style='color: #999;'>Nenhuma consulta agendada próxima.</p>"
}

// Renderizar Consultas
function renderizarConsultas() {
  const searchValue = document.getElementById("search-input").value.toLowerCase()
  const statusFilter = document.getElementById("status-filter").value

  const consultasFiltradas = consultas.filter((c) => {
    const matchSearch = c.paciente.toLowerCase().includes(searchValue) || c.id.toString().includes(searchValue)
    const matchStatus = !statusFilter || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const tbody = document.getElementById("consultas-tbody")
  tbody.innerHTML = consultasFiltradas
    .map(
      (c) => `
        <tr>
            <td>#${c.id}</td>
            <td>${c.paciente}</td>
            <td>${formatarData(c.data)} ${c.hora}</td>
            <td>${c.tipo}</td>
            <td>${c.profissional}</td>
            <td><span class="status-badge status-${c.status.replace(/\s+/g, "-")}">${c.status}</span></td>
            <td>
                <div class="actions">
                    <button class="btn-icon btn-edit" onclick="abrirModal(${c.id})">✏️</button>
                    <button class="btn-icon btn-delete" onclick="deletarConsulta(${c.id})">🗑️</button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("")
}

// Renderizar Pacientes
function renderizarPacientes() {
  const searchValue = document.getElementById("search-paciente").value.toLowerCase()
  const pacientesFiltrados = pacientesMock.filter((p) => p.nome.toLowerCase().includes(searchValue))

  const grid = document.getElementById("pacientes-grid")
  grid.innerHTML = pacientesFiltrados
    .map(
      (p) => `
        <div class="paciente-card">
            <div class="paciente-header">
                <div class="paciente-avatar">${p.nome.charAt(0).toUpperCase()}</div>
                <div class="paciente-info">
                    <h3>${p.nome}</h3>
                    <p>${p.email}</p>
                </div>
            </div>
            <div class="paciente-details">
                <p><strong>Telefone:</strong> ${p.telefone}</p>
                <p><strong>Diagnóstico:</strong> ${p.diagnostico}</p>
            </div>
        </div>
    `,
    )
    .join("")
}

// Renderizar Relatórios
function renderizarRelatorios() {
  const tipos = {}
  consultas.forEach((c) => {
    tipos[c.tipo] = (tipos[c.tipo] || 0) + 1
  })

  const chartTipos = document.getElementById("chart-tipos")
  chartTipos.innerHTML = Object.entries(tipos)
    .map(
      ([tipo, count]) => `
        <div style="margin: 10px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>${tipo}</span>
                <strong>${count}</strong>
            </div>
            <div style="background: #e0e0e0; height: 20px; border-radius: 4px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #9333ea, #a855f7); height: 100%; width: ${(count / 5) * 100}%;"></div>
            </div>
        </div>
    `,
    )
    .join("")

  const profissionais = {}
  consultas.forEach((c) => {
    profissionais[c.profissional] = (profissionais[c.profissional] || 0) + 1
  })

  const chartProf = document.getElementById("chart-profissionais")
  chartProf.innerHTML = Object.entries(profissionais)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([prof, count]) => `
            <div style="margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>${prof}</span>
                    <strong>${count}</strong>
                </div>
                <div style="background: #e0e0e0; height: 20px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #9333ea, #a855f7); height: 100%; width: ${(count / 5) * 100}%;"></div>
                </div>
            </div>
        `,
    )
    .join("")
}

// Deletar Consulta
function deletarConsulta(id) {
  if (confirm("Deseja deletar esta consulta?")) {
    consultas = consultas.filter((c) => c.id !== id)
    renderizarConsultas()
  }
}

// Utilitários
function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR")
}

// Event Listeners adicionais
document.getElementById("search-input").addEventListener("input", renderizarConsultas)
document.getElementById("status-filter").addEventListener("change", renderizarConsultas)
document.getElementById("search-paciente").addEventListener("input", renderizarPacientes)

// Inicializar
renderizarDashboard()
renderizarConsultas()

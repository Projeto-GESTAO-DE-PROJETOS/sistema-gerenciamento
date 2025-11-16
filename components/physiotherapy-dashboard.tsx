"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, Clock, Plus, Edit2, Trash2, ChevronRight, X } from "lucide-react"

interface Appointment {
  id: number
  patientName: string
  patientPhone: string
  date: string
  time: string
  therapist: string
  type: string
  status: "scheduled" | "completed" | "cancelled"
  notes: string
}

interface Patient {
  id: number
  name: string
  phone: string
  email: string
  appointmentCount: number
}

export default function PhysioMaxDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    date: "",
    time: "",
    therapist: "",
    type: "Fisioterapia Geral",
    status: "scheduled" as const,
    notes: "",
  })

  // Simular dados do banco de dados
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: 1,
        patientName: "João Silva",
        patientPhone: "(11) 98765-4321",
        date: "2024-11-08",
        time: "09:00",
        therapist: "Dr. Carlos",
        type: "Fisioterapia Geral",
        status: "scheduled",
        notes: "Dor nas costas",
      },
      {
        id: 2,
        patientName: "Maria Santos",
        patientPhone: "(11) 91234-5678",
        date: "2024-11-08",
        time: "10:30",
        therapist: "Dra. Ana",
        type: "Reabilitação",
        status: "scheduled",
        notes: "Lesão no joelho",
      },
      {
        id: 3,
        patientName: "Pedro Costa",
        patientPhone: "(11) 99999-8888",
        date: "2024-11-08",
        time: "14:00",
        therapist: "Dr. Carlos",
        type: "Acupuntura",
        status: "completed",
        notes: "Acompanhamento",
      },
    ]

    const mockPatients: Patient[] = [
      { id: 1, name: "João Silva", phone: "(11) 98765-4321", email: "joao@email.com", appointmentCount: 5 },
      { id: 2, name: "Maria Santos", phone: "(11) 91234-5678", email: "maria@email.com", appointmentCount: 3 },
      { id: 3, name: "Pedro Costa", phone: "(11) 99999-8888", email: "pedro@email.com", appointmentCount: 7 },
    ]

    setAppointments(mockAppointments)
    setPatients(mockPatients)
  }, [])

  const handleAddAppointment = () => {
    setEditingId(null)
    setFormData({
      patientName: "",
      patientPhone: "",
      date: "",
      time: "",
      therapist: "",
      type: "Fisioterapia Geral",
      status: "scheduled",
      notes: "",
    })
    setShowModal(true)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingId(appointment.id)
    setFormData({
      patientName: appointment.patientName,
      patientPhone: appointment.patientPhone,
      date: appointment.date,
      time: appointment.time,
      therapist: appointment.therapist,
      type: appointment.type,
      status: appointment.status,
      notes: appointment.notes,
    })
    setShowModal(true)
  }

  const handleDeleteAppointment = (id: number) => {
    setAppointments(appointments.filter((apt) => apt.id !== id))
  }

  const handleSaveAppointment = () => {
    if (!formData.patientName || !formData.date || !formData.time || !formData.therapist) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    if (editingId !== null) {
      setAppointments(appointments.map((apt) => (apt.id === editingId ? { ...apt, ...formData } : apt)))
    } else {
      const newAppointment: Appointment = {
        id: Math.max(...appointments.map((a) => a.id), 0) + 1,
        ...formData,
      }
      setAppointments([...appointments, newAppointment])
    }

    setShowModal(false)
  }

  const todayAppointments = appointments.filter(
    (apt) => apt.date === new Date().toISOString().split("T")[0] && apt.status === "scheduled",
  )

  const completedAppointments = appointments.filter((apt) => apt.status === "completed").length
  const totalPatients = patients.length

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f7ff" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#9333ea" }} className="text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} className="p-3 rounded-lg">
                <Users size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">PhysioMax</h1>
                <p className="text-purple-100">Sistema de Gerenciamento de Consultas</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ backgroundColor: "#ffffff" }} className="border-b" style={{ borderColor: "#e5e0ff" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: "📊" },
              { id: "appointments", label: "Consultas", icon: "📅" },
              { id: "patients", label: "Pacientes", icon: "👥" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  borderBottomColor: activeTab === tab.id ? "#9333ea" : "transparent",
                  color: activeTab === tab.id ? "#9333ea" : "#666",
                }}
                className="px-4 py-4 font-medium border-b-2 transition-all hover:text-purple-600"
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                style={{ backgroundColor: "#ffffff", borderLeftColor: "#9333ea" }}
                className="border-l-4 p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-2">Consultas Hoje</p>
                    <p className="text-3xl font-bold" style={{ color: "#9333ea" }}>
                      {todayAppointments.length}
                    </p>
                  </div>
                  <Calendar size={24} style={{ color: "#9333ea" }} />
                </div>
              </div>

              <div
                style={{ backgroundColor: "#ffffff", borderLeftColor: "#9333ea" }}
                className="border-l-4 p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-2">Consultas Completas</p>
                    <p className="text-3xl font-bold" style={{ color: "#9333ea" }}>
                      {completedAppointments}
                    </p>
                  </div>
                  <Clock size={24} style={{ color: "#9333ea" }} />
                </div>
              </div>

              <div
                style={{ backgroundColor: "#ffffff", borderLeftColor: "#9333ea" }}
                className="border-l-4 p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-2">Total de Pacientes</p>
                    <p className="text-3xl font-bold" style={{ color: "#9333ea" }}>
                      {totalPatients}
                    </p>
                  </div>
                  <Users size={24} style={{ color: "#9333ea" }} />
                </div>
              </div>
            </div>

            {/* Today's Appointments */}
            <div style={{ backgroundColor: "#ffffff" }} className="rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: "#9333ea" }}>
                Consultas de Hoje
              </h2>
              {todayAppointments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Nenhuma consulta agendada para hoje</p>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      style={{ backgroundColor: "#f8f7ff" }}
                      className="p-4 rounded-lg flex items-center justify-between border"
                      style={{ borderColor: "#e5e0ff" }}
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{apt.patientName}</p>
                        <p className="text-sm text-gray-600">
                          {apt.time} - {apt.therapist}
                        </p>
                      </div>
                      <ChevronRight style={{ color: "#9333ea" }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="space-y-6">
            <button
              onClick={handleAddAppointment}
              style={{ backgroundColor: "#9333ea" }}
              className="text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition"
            >
              <Plus size={20} />
              Nova Consulta
            </button>

            <div style={{ backgroundColor: "#ffffff" }} className="rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: "#f8f7ff", borderBottomColor: "#e5e0ff" }} className="border-b">
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#9333ea" }}>
                        Paciente
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#9333ea" }}>
                        Data/Hora
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#9333ea" }}>
                        Terapeuta
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#9333ea" }}>
                        Tipo
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#9333ea" }}>
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#9333ea" }}>
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr key={apt.id} style={{ borderBottomColor: "#e5e0ff" }} className="border-b hover:bg-purple-50">
                        <td className="px-6 py-4">
                          <p className="font-medium">{apt.patientName}</p>
                          <p className="text-sm text-gray-600">{apt.patientPhone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium">{new Date(apt.date).toLocaleDateString("pt-BR")}</p>
                          <p className="text-sm text-gray-600">{apt.time}</p>
                        </td>
                        <td className="px-6 py-4">{apt.therapist}</td>
                        <td className="px-6 py-4">{apt.type}</td>
                        <td className="px-6 py-4">
                          <span
                            style={{
                              backgroundColor:
                                apt.status === "scheduled"
                                  ? "#e5e0ff"
                                  : apt.status === "completed"
                                    ? "#dbeafe"
                                    : "#fee2e2",
                              color:
                                apt.status === "scheduled"
                                  ? "#9333ea"
                                  : apt.status === "completed"
                                    ? "#0284c7"
                                    : "#dc2626",
                            }}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {apt.status === "scheduled"
                              ? "Agendado"
                              : apt.status === "completed"
                                ? "Completo"
                                : "Cancelado"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditAppointment(apt)}
                              className="p-2 hover:bg-purple-100 rounded text-purple-600 transition"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteAppointment(apt.id)}
                              className="p-2 hover:bg-red-100 rounded text-red-600 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === "patients" && (
          <div style={{ backgroundColor: "#ffffff" }} className="rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6" style={{ color: "#9333ea" }}>
              Lista de Pacientes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  style={{ backgroundColor: "#f8f7ff", borderColor: "#e5e0ff" }}
                  className="border p-6 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{patient.name}</h3>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                    </div>
                    <div
                      style={{ backgroundColor: "#9333ea" }}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    >
                      {patient.name.charAt(0)}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-600">Telefone:</span>{" "}
                      <span className="font-medium">{patient.phone}</span>
                    </p>
                    <p>
                      <span className="text-gray-600">Consultas:</span>{" "}
                      <span className="font-medium">{patient.appointmentCount}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            style={{ backgroundColor: "#ffffff" }}
            className="rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: "#9333ea" }}>
                {editingId ? "Editar Consulta" : "Nova Consulta"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded transition">
                <X size={24} />
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                handleSaveAppointment()
              }}
            >
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#666" }}>
                  Nome do Paciente *
                </label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  style={{ borderColor: "#e5e0ff" }}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#666" }}>
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.patientPhone}
                  onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                  style={{ borderColor: "#e5e0ff" }}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#666" }}>
                  Data *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={{ borderColor: "#e5e0ff" }}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#666" }}>
                  Hora *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  style={{ borderColor: "#e5e0ff" }}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#666" }}>
                  Terapeuta *
                </label>
                <input
                  type="text"
                  value={formData.therapist}
                  onChange={(e) => setFormData({ ...formData, therapist: e.target.value })}
                  style={{ borderColor: "#e5e0ff" }}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#666" }}>
                  Tipo de Consulta
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  style={{ borderColor: "#e5e0ff" }}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>Fisioterapia Geral</option>
                  <option>Reabilitação</option>
                  <option>Acupuntura</option>
                  <option>Drenagem Linfática</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#666" }}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  style={{ borderColor: "#e5e0ff" }}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="scheduled">Agendado</option>
                  <option value="completed">Completo</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#666" }}>
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{ borderColor: "#e5e0ff" }}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ backgroundColor: "#f8f7ff", color: "#9333ea" }}
                  className="flex-1 px-4 py-2 rounded-lg font-medium hover:opacity-80 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: "#9333ea" }}
                  className="flex-1 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

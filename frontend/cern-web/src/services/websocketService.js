import { Client } from '@stomp/stompjs'

let stompClient = null

export const connectEmergencySocket = (topic, onEmergencyReceived) => {
  if (stompClient?.active) {
    stompClient.deactivate()
  }

  stompClient = new Client({
    brokerURL: `${import.meta.env.VITE_API_BASE_URL
  .replace("/api/v1", "")
  .replace("https://", "wss://")}/ws`,
    reconnectDelay: 5000,

    onConnect: () => {
      console.log(`WebSocket connected to /topic/${topic}`)

      stompClient.subscribe(`/topic/${topic}`, (message) => {
        try {
          const emergency = JSON.parse(message.body)
          onEmergencyReceived(emergency)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      })
    },

    onStompError: (frame) => {
      console.error('STOMP error:', frame)
    },

    onWebSocketError: (error) => {
      console.error('WebSocket error:', error)
    },
  })

  stompClient.activate()
}

export const disconnectEmergencySocket = () => {
  if (stompClient?.active) {
    stompClient.deactivate()
  }

  stompClient = null
}
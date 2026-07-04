import { Client } from '@stomp/stompjs'

let stompClient = null

export const connectEmergencySocket = (onEmergencyReceived) => {
  stompClient = new Client({
    brokerURL: 'ws://localhost:8080/ws',
    reconnectDelay: 5000,

    onConnect: () => {
      console.log('WebSocket connected')

      stompClient.subscribe('/topic/emergencies', (message) => {
        const emergency = JSON.parse(message.body)
        onEmergencyReceived(emergency)
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
  if (stompClient) {
    stompClient.deactivate()
  }
}
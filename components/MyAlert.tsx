import React from 'react'
import { Modal, View, Text, TouchableOpacity } from 'react-native'

type MyAlertProps = {
  visible: boolean
  title?: string
  message: string
  onCancel: () => void
  onConfirm: () => void
}

export default function MyAlert({
  visible,
  title = 'Confirmação',
  message,
  onCancel,
  onConfirm,
}: MyAlertProps) {
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <View
          style={{
            width: '80%',
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 10,
            }}
          >
            {title}
          </Text>

          <Text style={{ fontSize: 16, marginBottom: 20 }}>
            {message}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <TouchableOpacity style={{ marginRight: 16 }} onPress={onCancel}>
              <Text style={{ fontSize: 16, color: 'blue' }}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm}>
              <Text style={{ fontSize: 16, color: 'blue' }}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

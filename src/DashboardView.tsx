import React, { useState, useEffect, useRef } from 'react'

import logo from './logo.svg'
import {
  Page,
  useMediaQuery,
  Text,
  Row,
  Button,
  ButtonDropdown,
  Card,
  Popover,
  Image,
  Spacer,
  Divider,
  Input,
  Modal,
  Col,
  Textarea,
  AutoComplete,
} from '@zeit-ui/react'
//@ts-ignore
import Coverflow from 'react-coverflow'

import { Mic } from '@zeit-ui/react-icons'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from 'react-router-dom'
import { brandPrimary } from './theme'
import { AuthUser, MuxLiveKey, useMuxLiveKey } from './firebase-hooks'

export const DashboardView = ({ authUser }: { authUser: AuthUser }) => {
  const history = useHistory()
  console.log({ authUser })
  const isWideDisplay = useMediaQuery('md', { match: 'up' })
  const { muxLiveKey, isMuxLiveKeyLoading } = useMuxLiveKey(authUser.uid)
  if (isMuxLiveKeyLoading || muxLiveKey === null || muxLiveKey === undefined) {
    return <div>Loading</div>
  } else {
    return <DashboardLiveView muxLiveKey={muxLiveKey} />
  }
}

const DashboardLiveView = ({ muxLiveKey }: { muxLiveKey: MuxLiveKey }) => {
  const [hasMicrophoneAccess, sethasMicrophoneAccess] = useState(false)
  const [connected, setConnected] = useState(false)
  const [streaming, setStreaming] = useState(false)

  const wsRef = useRef()
  const mediaRecorderRef = useRef()
  const inputStreamRef = useRef()
  console.log({ muxLiveKey })
  const stopStreaming = () => {
    //@ts-ignore
    mediaRecorderRef.current.stop()
    setStreaming(false)
  }
  useEffect(() => {
    if (navigator.mediaDevices) {
      const protocol = window.location.protocol.replace('http', 'ws')
      if (process.env.NODE_ENV === 'development') {
        //@ts-ignore
        wsRef.current = new WebSocket(
          `ws://localhost:8001/rtmp?key=${muxLiveKey.stream_key}`
        )
      }
      //@ts-ignore
      wsRef.current.addEventListener('open', function open() {
        setConnected(true)
      })
      //@ts-ignore
      wsRef.current.addEventListener('close', () => {
        setConnected(false)
        stopStreaming()
      })

      const constraints = { audio: true }
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
          sethasMicrophoneAccess(true)
          // @ts-ignore
          inputStreamRef.current = stream
          // @ts-ignore
          mediaRecorderRef.current = new MediaRecorder(stream, {
            audioBitsPerSecond: 128000,
          })
          //@ts-ignore
          mediaRecorderRef.current.addEventListener('dataavailable', (e) => {
            //@ts-ignore
            if (wsRef.current.readyState === 1) {
              //@ts-ignore
              wsRef.current.send(e.data)
            }
          })
          //@ts-ignore
          mediaRecorderRef.current.addEventListener('stop', () => {
            // stopStreaming()
            //@ts-ignore
            wsRef.current.close()
          })
          //@ts-ignore
          mediaRecorderRef.current.start(1000)
        })
        .catch((e) => console.error(e))
    }

    return () => {
      console.log('THIS FIRES')
      //@ts-ignore
      // if (inputStreamRef.current && mediaRecorderRef.current) {
      //   stopStreaming()
      // }
    }
  }, [muxLiveKey.stream_key])

  return (
    <>
      <Page>
        <Card>
          {streaming && connected && hasMicrophoneAccess ? (
            <Text h3>You are Live</Text>
          ) : (
            <Text h3>Activating Microphone</Text>
          )}
        </Card>
      </Page>
    </>
  )
}

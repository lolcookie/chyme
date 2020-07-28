import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
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
  AutoComplete
} from "@zeit-ui/react";
//@ts-ignore
import Coverflow from "react-coverflow";

import { Mic } from "@zeit-ui/react-icons";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import { brandPrimary } from "./theme";
import {
  createLiveStream,
  useUserStreams,
  User,
  UserStream,
  pushRealtimeChunk
} from "./firebase-hooks";

export const DashboardView = ({ user }: { user: User }) => {
  const history = useHistory();
  const { userStreams, isUserStreamsLoading } = useUserStreams(user.uid);
  const isWideDisplay = useMediaQuery("md", { match: "up" });
  console.log({ userStreams });
  if (isUserStreamsLoading || userStreams === undefined) {
    return <div>Loading</div>;
  } else if (userStreams === null) {
    return <div>Something went wrong please go back</div>;
  } else {
    return <DashboardLiveView userStreams={userStreams} />;
  }
};

const DashboardLiveView = ({ userStreams }: { userStreams: UserStream[] }) => {
  const [hasMicrophoneAccess, sethasMicrophoneAccess] = useState(false);
  console.log(userStreams);
  useEffect(() => {
    //@ts-ignore
    let mediaRecorder;
    //@ts-ignore
    let mediaStream;

    if (navigator.mediaDevices) {
      console.log("getUserMedia supported.");

      const constraints = { audio: true };
      let chunks = [];
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
          mediaStream = stream;
          // @ts-ignore
          mediaRecorder = new MediaRecorder(stream, {
            audioBitsPerSecond: 128000
          });
          mediaRecorder.start(1000);
          sethasMicrophoneAccess(true);
          mediaRecorder.addEventListener("dataavailable", (e: any) => {
            console.log("DATA AVAILABLE");
            // Then send the binary data via the WebSocket connection!
            pushRealtimeChunk(userStreams[0].uid, e.data);
            console.log(e);
          });
        })
        .catch(e => console.error(e));
    }

    return () => {
      console.log("THIS FIRES");
      //@ts-ignore
      if (mediaRecorder && mediaStream) {
        //@ts-ignore
        mediaStream.getTracks().forEach(track => track.stop());
        //@ts-ignore
        mediaRecorder.stop();
      }
    };
  }, []);

  return (
    <>
      <Page>
        <Card>
          {hasMicrophoneAccess ? (
            <Text h3>You are Live</Text>
          ) : (
            <Text h3>Activating Microphone</Text>
          )}
        </Card>
      </Page>
    </>
  );
};

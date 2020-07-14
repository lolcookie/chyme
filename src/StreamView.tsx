import React, { useState } from "react";
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

import { Power, Menu, Search, ChevronLeft } from "@zeit-ui/react-icons";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const brandPrimary = "#50E3C2";
const brandSecondary = "#6558f5";
const ChatMessage = ({
  isAdmin,
  isPlaying
}: {
  isAdmin?: boolean;
  isPlaying?: boolean;
}) => {
  return (
    <>
      <Card
        hoverable
        style={isPlaying ? { backgroundColor: brandPrimary } : {}}
      >
        <p>Some test Message</p>
        <Card.Footer>
          <Row justify="space-between" style={{ width: "100%" }}>
            <p>User12312</p>
            <Row justify="end">
              {isPlaying ? (
                <Button size="mini" style={{ marginRight: "4px" }}>
                  Stop
                </Button>
              ) : (
                <Button size="mini" style={{ marginRight: "4px" }}>
                  Replay
                </Button>
              )}
            </Row>
          </Row>
        </Card.Footer>
      </Card>
      <Spacer y={1} />
    </>
  );
};

const ExampleBlock = () => (
  <div style={{ height: "100%", width: "100%", backgroundColor: "black" }} />
);

export const StreamView = () => {
  const isWideDisplay = useMediaQuery("md", { match: "up" });
  const [state, setState] = useState(false);
  const handler = () => setState(true);
  const closeHandler = () => {
    setState(false);
    console.log("closed");
  };

  return (
    <>
      <Row justify="center" style={{ backgroundColor: "black" }}>
        <Image
          src="https://www.100gecs.com/images/RFPCover.jpg"
          alt="Album one"
          style={{ maxHeight: isWideDisplay ? "280px" : "160px" }}
        />
      </Row>
      <Row
        justify="space-between"
        align="middle"
        style={{ padding: "8px", backgroundColor: "black" }}
      >
        <Text size={16} style={{ margin: 0, color: "white" }}>
          Some Stream - Streamer
        </Text>
        <Row>
          <Button size="mini" style={{ marginRight: "4px" }}>
            Follow
          </Button>
          <Button size="mini" onClick={handler}>
            Subscribe
          </Button>
          <Modal open={state} onClose={closeHandler}>
            <Modal.Title>Modal</Modal.Title>
            <Modal.Subtitle>This is a modal</Modal.Subtitle>
            <Modal.Content>
              <p>Some content contained within the modal.</p>
            </Modal.Content>
            <Modal.Action passive onClick={() => setState(false)}>
              Cancel
            </Modal.Action>
            <Modal.Action>Submit</Modal.Action>
          </Modal>
        </Row>
      </Row>

      <div
        style={{
          padding: "8px",
          height: isWideDisplay ? "calc(100vh - 58px)" : "calc(100vh - 383px)",
          overflow: "auto"
        }}
      >
        <ChatMessage isAdmin />
        <ChatMessage isPlaying />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
        <ChatMessage />
      </div>
      <div style={{ padding: "8px", height: "110px" }}>
        <Button
          style={{
            marginBottom: "4px",
            width: "100%",
            backgroundColor: brandSecondary,
            color: "white"
          }}
        >
          RECORD MESSAGE
        </Button>
        <Row>
          <Col
            span={20}
            style={{
              marginRight: "8px",
              backgroundColor: "white",
              borderRadius: "5px"
            }}
          >
            <Textarea
              style={{
                maxHeight: "38px"
              }}
              minHeight="38px"
              width="100%"
              placeholder="Send a message (TTS)"
            />
          </Col>
          <Col span={4}>
            <Button
              auto
              style={{
                width: "100%",
                backgroundColor: brandSecondary,
                color: "white"
              }}
            >
              SEND
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

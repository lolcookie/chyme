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

import { Mic } from "@zeit-ui/react-icons";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import { brandPrimary } from "./theme";
import { createLiveStream } from "./firebase-hooks";

export const StartStreamView = () => {
  const history = useHistory();
  const isWideDisplay = useMediaQuery("md", { match: "up" });
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const canSubmit = title.length > 0;
  return (
    <>
      <Page>
        <Card>
          <Text h3>Start Broadcasting</Text>
          <Text>Give your stream a title </Text>
          <Input
            placeholder="My first stream"
            width={"100%"}
            onChange={e => setTitle(e.target.value)}
          />
          <Text type="error">{error}</Text>
          <Spacer />
          <Row justify="end">
            <Button
              disabled={!canSubmit}
              style={{
                backgroundColor: brandPrimary,
                color: "white",
                opacity: canSubmit ? 1 : 0.5
              }}
              onClick={() => {
                createLiveStream({ title }).then(() =>
                  history.push("/dashboard")
                );
              }}
              iconRight={<Mic color="white" />}
            >
              Start
            </Button>
          </Row>
        </Card>
      </Page>
    </>
  );
};

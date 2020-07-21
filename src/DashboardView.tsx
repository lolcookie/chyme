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

export const DashboardView = () => {
  const history = useHistory();
  const isWideDisplay = useMediaQuery("md", { match: "up" });
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const canSubmit = title.length > 0;
  return (
    <>
      <Page>
        <Card>
          <Text h3>You are Live</Text>
        </Card>
      </Page>
    </>
  );
};

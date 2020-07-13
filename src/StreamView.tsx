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
  Input,
  Col,
  AutoComplete
} from "@zeit-ui/react";
//@ts-ignore
import Coverflow from "react-coverflow";

import { Power, Menu, Search, ChevronLeft } from "@zeit-ui/react-icons";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const brandPrimary = "#50E3C2";

export const StreamView = () => <Text h3>About</Text>;

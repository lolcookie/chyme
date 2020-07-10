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
  Col
} from "@zeit-ui/react";
//@ts-ignore
import Coverflow from "react-coverflow";

import { Power, Menu, Search, ChevronLeft } from "@zeit-ui/react-icons";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const brandPrimary = "#50E3C2";

const Logo = ({ white }: { white?: boolean }) => (
  <Text size={24} style={{ color: white ? "white" : brandPrimary }}>
    Chyme
  </Text>
);
//
const CoverFlowComponent = () => (
  <div
    style={{
      width: "100%"
    }}
  >
    <Coverflow
      width="auto"
      height="500"
      displayQuantityOfSide={2}
      navigation={false}
      enableScroll={false}
      clickable={true}
      active={0}
      media={{
        "@media (max-width: 900px)": {
          width: "600px",
          height: "300px"
        },
        "@media (min-width: 900px)": {
          width: "960px",
          height: "600px"
        }
      }}
    >
      <img
        src="https://www.100gecs.com/images/RFPCover.jpg"
        alt="Album one"
        data-action="https://facebook.github.io/react/"
      />
      <img
        src="https://www.100gecs.com/images/RFPCover.jpg"
        alt="Album two"
        data-action="http://passer.cc"
      />
      <img
        src="https://www.100gecs.com/images/RFPCover.jpg"
        alt="Album three"
        data-action="https://doce.cc/"
      />
      <img
        src="https://www.100gecs.com/images/RFPCover.jpg"
        alt="Album four"
        data-action="http://tw.yahoo.com"
      />
    </Coverflow>
  </div>
);

const Navbar = () => {
  const [searchText, setSearchText] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const handler = (e: any) => {
    setSearchText(e.target.value);
    console.log(e.target.value);
  };
  const isWideDisplay = useMediaQuery("md", { match: "up" });
  const content = () => (
    <>
      <Popover.Item title>
        <span>User Settings</span>
      </Popover.Item>
      <Popover.Item>
        <Link to="#">A hyperlink</Link>
      </Popover.Item>
      <Popover.Item>
        <Link to="#">A hyperlink for edit profile</Link>
      </Popover.Item>
      <Popover.Item line />
      <Popover.Item>
        <span>Command-Line</span>
      </Popover.Item>
    </>
  );
  return isSearchActive ? (
    <>
      <Row
        align="middle"
        style={{
          height: "71px",
          display: "absolute",
          backgroundColor: brandPrimary,
          paddingRight: isWideDisplay ? "32px" : "16px",
          paddingLeft: isWideDisplay ? "32px" : "16px"
        }}
      >
        <Button
          onClick={() => setIsSearchActive(false)}
          size="large"
          style={{
            minWidth: "44px",
            padding: 0,
            backgroundColor: "transparent",
            border: "none"
          }}
          icon={<ChevronLeft color="white" />}
        />
        <input
          value={searchText}
          onChange={handler}
          style={{
            width: "100%",
            marginLeft: "8px",
            backgroundColor: "transparent",
            border: "none",
            borderBottom: "1px solid gray"
          }}
          placeholder="Search"
        />
        <Button
          onClick={() => setIsSearchActive(true)}
          size="large"
          style={{
            minWidth: "64px",
            padding: 0,
            backgroundColor: "transparent",
            border: "none"
          }}
          icon={<Search color="white" />}
        />
      </Row>
    </>
  ) : (
    <Row
      align="middle"
      justify="space-between"
      style={{
        backgroundColor: brandPrimary,
        paddingRight: isWideDisplay ? "32px" : "16px",
        paddingLeft: isWideDisplay ? "32px" : "16px"
      }}
    >
      <Link to="/">
        <Logo white />
      </Link>
      {isWideDisplay ? (
        <Input
          icon={<Search color="white" />}
          value={searchText}
          onChange={handler}
          placeholder="Search"
          clearable
        />
      ) : null}
      <Row align="middle">
        {isWideDisplay ? null : (
          <Button
            onClick={() => setIsSearchActive(true)}
            size="large"
            style={{
              minWidth: "64px",
              padding: 0,
              backgroundColor: "transparent",
              border: "none"
            }}
            icon={<Search color="white" />}
          />
        )}

        <Popover
          placement="bottomEnd"
          content={content}
          style={{
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <Menu color="white" />
        </Popover>
      </Row>
    </Row>
  );
};

const About = () => <Text h3>About</Text>;

const Dashboard = () => <Text h3>About</Text>;

const HomeStationCard = () => (
  <Card shadow>
    <Row align="middle">
      <div style={{ height: "100px", width: "100px", borderRadius: "4px" }}>
        <Image
          src="https://www.100gecs.com/images/RFPCover.jpg"
          height={100}
          width={100}
          style={{ objectFit: "cover", borderRadius: "4px" }}
        />
      </div>
      <Col style={{ paddingLeft: "16px", paddingRight: "16px" }}>
        <h4>The Evil Rabbit</h4>
        <p>shadow card.</p>
      </Col>
    </Row>
  </Card>
);

const Home = () => (
  <div style={{ backgroundColor: "#FAFAFA" }}>
    <CoverFlowComponent />
    <Page>
      <Text h3 style={{ textAlign: "left" }}>
        Recommended
      </Text>
      <HomeStationCard />
      <Spacer y={1} />

      <HomeStationCard />
      <Spacer y={1} />

      <HomeStationCard />
      <Spacer y={1} />

      <HomeStationCard />
    </Page>
  </div>
);

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

import { Affix, Drawer, Layout } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidenav from "../Sidenav/Sidenav";
import Footer from "./Footer";
import Header from "./Header";
import styles from "./Main.module.css";
import QuickLinks from "./QuickLinks";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import checkTokenExp from "../../utils/checkTokenExp";

const { Header: AntHeader, Content, Sider } = Layout;

function Main({ children }) {
	const dispatch = useDispatch();

	// get the token from local storage and decode JWT Token and get the user id from the token
	const token = localStorage.getItem("access-token");

	useEffect(() => {
		if (token) {
			checkTokenExp(token);
			const id = jwtDecode(token).sub;
		}
	}, []);

	const [collapsed, setCollapsed] = useState(false);
	const [sideNavOpenKeys, setSideNavOpenKeys] = useState("");

	const sideNavOpenKeysHandler = (val) => {
		setSideNavOpenKeys(val);
	};

	const handleCollapsed = (val) => {
		setCollapsed(val);
	};

	const [visible, setVisible] = useState(false);
	const [placement, setPlacement] = useState("right");
	const [sidenavColor, setSidenavColor] = useState("#1890ff");
	const [fixed, setFixed] = useState(false);

	const openDrawer = () => setVisible(!visible);

	const handleSidenavColor = (color) => setSidenavColor(color);
	const handleFixedNavbar = (type) => setFixed(type);

	let { pathname } = useLocation();
	pathname = pathname.replace("/", " ");

	const pathArr = pathname.split("/");

	useEffect(() => {
		if (pathname === "rtl") {
			setPlacement("left");
		} else {
			setPlacement("right");
		}
	}, [pathname]);

	const isLogged = Boolean(localStorage.getItem("isLogged"));
	const backgroundImageStyle = {
		backgroundImage: `url('/assets/img/signInImage.png')`, // Use the imported background image
		backgroundSize: 'cover', // You can adjust this to control how the image is sized
		backgroundRepeat: 'no-repeat',
		height: '100%', // Set a height to cover the entire viewport
		zIndex: 0, // Place the background image below the overlay
	};


	if (pathArr[0].trim() === "admin") {
		return (
			<Layout className={styles.mainLayout  }>
				{isLogged && (
					<Drawer
						title={false}
						placement={placement === "right" ? "left" : "right"}
						closable={false}
						onClose={() => setVisible(false)}
						visible={visible}
						key={placement === "right" ? "left" : "right"}
						width={260}>
						<Layout>
							<Sider
								trigger={null}
								width={260}
								theme='light'
								className={styles.siderDrawer}>
								<Sidenav
									color={sidenavColor}
									sideNavOpenKeys={sideNavOpenKeys}
								/>
							</Sider>
						</Layout>
					</Drawer>
				)}
				{isLogged && (
					<Sider
						breakpoint='lg'
						trigger={null}
						collapsible
						collapsed={collapsed}
						width={260}
						wi
						theme='light'
						className={`${styles.siderMain} scrollbar-hide`}>
						{collapsed ? (
							""
						) : (
							<div>
								<h2
									className='text-white text-center mt-2 mb-1 '
									style={{ fontSize: "25px" }}>
									Kucing
									<strong style={{ color: "#6ECCAF	", fontWeight: "bold" }}>
										{" "}
										Kawin
									</strong>
								</h2>
							</div>
						)}
						{isLogged && (
							<Sidenav color={sidenavColor} sideNavOpenKeys={sideNavOpenKeys} />
						)}
					</Sider>
				)}
				<Layout
					className={
						isLogged
							? collapsed
								? styles.mainLayoutUncollapse
								: styles.mainLayoutCollapse
							: styles.mainLayoutMarginLeftZero
					}>
					{fixed ? (
						<Affix>
							<AntHeader>
								<Header
									onPress={openDrawer}
									name={pathname}
									subName={pathname}
									handleSidenavColor={handleSidenavColor}
									handleFixedNavbar={handleFixedNavbar}
									collapsed={collapsed}
									handleCollapsed={handleCollapsed}
									isLogged={isLogged}
								/>
							</AntHeader>
						</Affix>
					) : (
						<AntHeader>
							<Header
								onPress={openDrawer}
								name={pathname}
								subName={pathname}
								handleSidenavColor={handleSidenavColor}
								handleFixedNavbar={handleFixedNavbar}
								collapsed={collapsed}
								handleCollapsed={handleCollapsed}
							/>
						</AntHeader>
					)}
					{isLogged &&
						(pathname.trim() === "dashboard" || pathname.trim() === "") && (
							<QuickLinks
								sideNavOpenKeys={sideNavOpenKeys}
								sideNavOpenKeysHandler={sideNavOpenKeysHandler}
							/>
						)}

					<Content>{children}</Content>
					<Footer />
				</Layout>
			</Layout>

		);
	}

	return <>{children}</>;
}

export default Main;

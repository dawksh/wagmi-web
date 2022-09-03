import type { NextPage } from "next";
import Navbar from "./components/Navbar";
import Input from "./components/Input";
import TextArea from "./components/TextArea";

const Home: NextPage = () => {
	return (
		<div className="flex justify-center flex-space flex-col">
			<Navbar />
			<span className="mx-40 mt-10">
				<TextArea />
			</span>
			<span className="flex justify-center m-6">
				<Input placeholder={"Wallet Address"} handler={() => {}} />
			</span>
		</div>
	);
};

export default Home;

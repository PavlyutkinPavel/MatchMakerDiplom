import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./components/sign-up/SignUp";
import VerificationCodeInput from "./components/sign-up/VerificationCodeInput";
import SignInSide from "./components/sign-in-side/SignInSide";
import Pricing from "./components/pricing/Pricing";
import ScrollToTop from "./components/UI/ScrollToTop";
import CrudAdvanced from "./components/crud_all/components/CrudAdvanced";
import DashboardLayoutAccountSidebar from "./components/crud_all/components/DashboardLayoutBasic";
import PrivateRoute from "./PrivateRoute";
import useApplicationStore from "./components/utils/store/store";
import MatchMaker from "./components/blog/MatchMaker";
import ResetPassword from "./components/sign-in-side/components/ResetPassword";
import VerificationCodeInputRq from "./components/sign-up/VerificationCodeInputRq";

function App() {
    const { isAuthenticated} = useApplicationStore();

    return (
        <Router>
            <div>
                <ScrollToTop/>
                <Routes>
                    <Route path="/" element={<MatchMaker/>}/>
                    <Route path="/pricing" element={<Pricing/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route path="/signin" element={<SignInSide/>}/>
                    <Route path="/tournament" element={<DashboardLayoutAccountSidebar/>}/>
                    <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                        <Route path="/team" element={<CrudAdvanced />} />
                    </Route>
                    <Route path="/verification" element={<VerificationCodeInput/>}/>
                    <Route path="/verification_rq" element={<VerificationCodeInputRq/>}/>
                    <Route path="/reset_password" element={<ResetPassword/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChooseRole from "./pages/ChooseRole";
import BrowseBooks from "./pages/BrowseBooks";
import BookDetails from "./pages/BookDetails";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/shared/PrivateRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";

import UserOverview from "./pages/dashboard/user/UserOverview";
import DeliveryHistory from "./pages/dashboard/user/DeliveryHistory";
import ReadingList from "./pages/dashboard/user/ReadingList";
import MyReviews from "./pages/dashboard/user/MyReviews";

import LibrarianOverview from "./pages/dashboard/librarian/LibrarianOverview";
import AddBook from "./pages/dashboard/librarian/AddBook";
import ManageInventory from "./pages/dashboard/librarian/ManageInventory";
import ManageDeliveries from "./pages/dashboard/librarian/ManageDeliveries";

import AdminOverview from "./pages/dashboard/admin/AdminOverview";
import BookApprovals from "./pages/dashboard/admin/BookApprovals";
import ManageUsers from "./pages/dashboard/admin/ManageUsers";
import ManageAllBooks from "./pages/dashboard/admin/ManageAllBooks";
import Transactions from "./pages/dashboard/admin/Transactions";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/choose-role" element={<ChooseRole />} />
      <Route path="/books" element={<BrowseBooks />} />
      <Route path="/books/:id" element={<BookDetails />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="user" element={<UserOverview />} />
          <Route path="user/history" element={<DeliveryHistory />} />
          <Route path="user/reading-list" element={<ReadingList />} />
          <Route path="user/reviews" element={<MyReviews />} />

          <Route path="librarian" element={<LibrarianOverview />} />
          <Route path="librarian/add-book" element={<AddBook />} />
          <Route path="librarian/inventory" element={<ManageInventory />} />
          <Route path="librarian/deliveries" element={<ManageDeliveries />} />

          <Route path="admin" element={<AdminOverview />} />
          <Route path="admin/approvals" element={<BookApprovals />} />
          <Route path="admin/users" element={<ManageUsers />} />
          <Route path="admin/books" element={<ManageAllBooks />} />
          <Route path="admin/transactions" element={<Transactions />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
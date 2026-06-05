import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import AdminHome from "./admin/AdminHome";
import CustomerHome from "./customer/CustomerHome";
import TailorHome from "./tailor/TailorHome";
import AddTailorSpecialization from "./admin/AddTailorSpecialization";
import AddCustomer from "./admin/customers/AddCustomer";
import CustomerList from "./admin/customers/CustomerList";
import EditCustomer from "./admin/customers/EditCustomer";
import AddMeasurement from "./admin/measurements/AddMeasurement";
import MeasurementList from "./admin/measurements/MeasurementList";
import ViewMeasurement from "./admin/measurements/ViewMeasurement";
import OrdersHome from "./admin/orders/OrdersHome";
import AddOrderItem from "./admin/orders/AddOrderItem";
import CreateOrder from "./admin/orders/CreateOrder";
import UpdateStatus from "./admin/orders/UpdateStatus";
import OrderList from "./admin/orders/OrderList";
import AdminOrderDetails from "./admin/orders/AdminOrderDetails";
import CustomerOrders from "./customer/CustomerOrders";
import CustomerOrderDetails from "./customer/CustomerOrderDetails";
import TailorRegister from "./pages/TailorRegister";  
import CustomerRegister from "./pages/CustRegister";
import AdminOrderBilling from "./admin/AdminOrderBilling";

import Landing from "./pages/Landing";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/customer/home" element={<CustomerHome />} />
        <Route path="/tailor/home" element={<TailorHome />} />
        <Route path="/admin/add-specialization" element={<AddTailorSpecialization />} />
        <Route path="/admin/add-customer" element={<AddCustomer />} />
        <Route path="/admin/customers" element={<CustomerList />} />
        <Route path="/admin/edit-customer/:id" element={<EditCustomer />} />
        <Route path="/admin/add-measurement" element={<AddMeasurement />} />
        <Route path="/admin/measurements" element={<MeasurementList />} />
        <Route path="/admin/measurement/:id" element={<ViewMeasurement />} />
        <Route path="/admin/orders" element={<OrdersHome />} />
        <Route path="/admin/orders/add-item" element={<AddOrderItem />} />
        <Route path="/admin/orders/create" element={<CreateOrder />} />
        <Route path="/admin/orders/update-status" element={<UpdateStatus />} />
        <Route path="/admin/orders/list" element={<OrderList />} />
        <Route path="/admin/orders/:orderId" element={<AdminOrderDetails />} />
        <Route path="/customer/orders" element={<CustomerOrders />} />
        <Route path="/customer/orders/:orderId" element={<CustomerOrderDetails />} />
        <Route path="/tailor-register" element={<TailorRegister />} />
        <Route path="/register" element={<CustomerRegister />} />
        <Route path="/admin/order-billing" element={<AdminOrderBilling />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

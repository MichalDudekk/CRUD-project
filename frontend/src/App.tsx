// src/App.tsx
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Error404 } from "./pages/Error404";

function App() {
    return (
        <>
            <nav className="mb-4 gap-4 flex">
                <Link to="/" className="text-blue-500 underline">
                    Adagio
                </Link>
                <Link to="/login" className="text-blue-500 underline">
                    Login
                </Link>
            </nav>

            <div className="ml-1 mr-1 sm:ml-[10%] sm:mr-[10%] ">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />

                    <Route path="*" element={<Error404 />} />
                </Routes>
            </div>
        </>
    );

    // const [products, setProducts] = useState<Product[]>([]);
    // const [error, setError] = useState("");

    // return (
    //     <div className="min-h-screen bg-gray-900 text-white p-10">
    //         <h1 className="text-3xl font-bold mb-6 text-blue-400">Test API</h1>

    //         {error && (
    //             <div className="bg-red-500 p-4 rounded mb-4">{error}</div>
    //         )}

    //         <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
    //             {products.map((p) => (
    //                 <div
    //                     key={p.ProductID}
    //                     className="bg-gray-800 p-4 rounded-xl border border-gray-700"
    //                 >
    //                     <h2 className="text-xl font-bold">{p.Name}</h2>
    //                     <p className="text-gray-400">{p.Description}</p>
    //                     <p className="text-green-400 font-mono mt-2">
    //                         {p.UnitPrice} PLN
    //                     </p>
    //                 </div>
    //             ))}
    //         </div>
    //     </div>
    // );
}

export default App;

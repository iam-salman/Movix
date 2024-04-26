import React, { useEffect } from "react";
import { fetchDataFromApi } from "./utils/api";
import { useDispatch, useSelector } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Explore from "./pages/explore/Explore";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import PageNotFound from "./pages/404/PageNotFound";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
    const dispatch = useDispatch();

    const fetchApiConfig = () => {
        fetchDataFromApi("/configuration").then((res) => {
            const url = {
                backdrop: res?.images?.secure_base_url + "original",
                poster: res?.images?.secure_base_url + "original",
                profile: res?.images?.secure_base_url + "original",
            };
            dispatch(getApiConfiguration(url));
        });
    };

    const genresCall = async () => {
        let promises = [];
        let endpoints = ["tv", "movie"];
        let allGenres = {};

        endpoints.forEach((url) => {
            promises.push(fetchDataFromApi(`/genre/${url}/list`));
        });

        const data = await Promise.all(promises);

        data?.map(({ genres }) => {
            return genres.map((item) => (allGenres[item.id] = item));
        });

        dispatch(getGenres(allGenres));
    };

    useEffect(() => {
        fetchApiConfig();
        genresCall();
    }, []);

    return (
        <div className="">
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search/:query" element={<SearchResult />} />
                    <Route path="/explore/:mediaType" element={<Explore />} />
                    <Route path="/:mediaType/:id" element={<Details />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>

                <Footer />
            </BrowserRouter>
        </div>
    );
};

export default App;

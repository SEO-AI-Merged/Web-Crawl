import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from '@heroicons/react/24/outline'
import { supabase } from '../api/supabaseClient';


const URLChecker = () => {

    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [crawlContent, setCrawlContent] = useState([]);
    const [urlArray, setUrlArray] = useState([]);
    const [urlArray1, setUrlArray1] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1;
    const indexOfCurrentItem = (currentPage - 1) * itemsPerPage;
    const currentItem = crawlContent.slice(indexOfCurrentItem, indexOfCurrentItem + itemsPerPage);
    const totalPages = Math.ceil(crawlContent.length / itemsPerPage);
    const [activeTab, setActiveTab] = useState('Tab 1');

    const handleURL = (e) => {
        const inputUrls = e.target.value;
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        const extractedUrls = inputUrls.match(urlPattern) || [];
        setUrlArray(extractedUrls);
    };

    const handleURL1 = (e) => {
        const inputUrls1 = e.target.value;
        const urlPattern1 = /(https?:\/\/[^\s]+)/g;
        const extractedUrls1 = inputUrls1.match(urlPattern1) || [];
        setUrlArray1(extractedUrls1);
    };

    const checkURL = async () => {
        setCrawlContent([])
        const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        const validUrls = urlArray.filter((url) => regex.test(url));
        const validUrls1 = urlArray1.filter((url) => regex.test(url));

        if (urlArray.length) {
            if (validUrls.length !== urlArray.length) {
                setMessage('Invalid URL format');
            } else {
                try {
                    const responses = await Promise.all(
                        validUrls.map((url) =>
                            axios.post('http://localhost:8016/api/crawl/target', { data: url })
                        )
                    );
                    const tmp = responses.map((res) => res?.data?.msg || '');
                    setCrawlContent(tmp);
                } catch (err) {
                    console.error(err);
                }
            }
        }

        if (urlArray1.length) {
            if (validUrls1.length !== urlArray1.length) {
                setMessage('Invalid URL format');
            } else {
                try {
                    const responses = await Promise.all(
                        validUrls1.map((url) =>
                            axios.post('http://localhost:8016/api/crawl/sitemap', { data: url })
                        )
                    );
                    const tmp = responses.map((res) => res?.data?.msg || '');
                    setCrawlContent(tmp);
                } catch (err) {
                    console.error(err);
                }
            }
        }
    };

    const formatHTML = (html) => {
        const tab = '\t';
        let result = '';
        let indent = '';

        html.split(/>\s*</).forEach(function (element) {
            if (element.match(/^\/\w/)) indent = indent.substring(tab.length);
            result += indent + '<' + element + '>\r\n';
            if (element.match(/^<?\w[^>]*[^\/]$/)) indent += tab;
        });

        return result.substring(1, result.length - 3);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    useEffect(() => {
        Prism.highlightAll();
    }, [crawlContent]);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setUrlArray([]);
                setUrlArray1([]);
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const clear = () => {
        setCrawlContent([])
        handleTabClick('Tab 1')
    }

    const Tab = ({ title, active, onClick }) => (
        <div
            className={`cursor-pointer py-2 px-4 border-b-2 ${active ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-600'
                }`}
            onClick={onClick}
        >
            {title}
        </div>
    );

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setUrlArray([])
        setUrlArray1([])
    };

    const saveContent = async () => {
        const { data, error } = await supabase
            .from('crawl')
            .insert([{ 
                target: urlArray, 
                sitemap: urlArray1, 
                project_name: "", 
                content: crawlContent }]);
        if (error) console.error(error);
        else {
            alert("success")
            console.log(data);
        }
    };

    return (
        <>
            <div className='py-12 px-8'>
                <div className='text-center text-2xl font-bold'>
                    Web Crawl Page
                </div>
                <div className='mt-4'>
                    <div className='flex justify-between px-4'>
                        <div className="block text-lg font-bold leading-6 text-gray-900">
                            URL INPUT PART
                        </div>
                        {
                            isVisible && <p className='text-red-500 font-bold'> {message} </p>
                        }
                        <div className='flex gap-2 justify-between'>
                            <button
                                className="border-[1px] border-indigo-600 float-right rounded bg-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-sm hover:bg-white hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                onClick={clear}
                            >Clear</button>
                            <button
                                className="border-[1px] border-indigo-600 float-right rounded bg-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-sm hover:bg-white hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                onClick={checkURL}>Start</button>
                        </div>
                    </div>
                    <div className="App mt-4 border-[1px] p-2 bg-slate-100 rounded-lg">
                        <header className="App-header">
                            <div className="w-full">
                                <div className="flex space-x-4 border-b">
                                    <Tab
                                        title="Manual"
                                        active={activeTab === 'Tab 1'}
                                        onClick={() => handleTabClick('Tab 1')}
                                    />
                                    <Tab
                                        title="SiteMap"
                                        active={activeTab === 'Tab 2'}
                                        onClick={() => handleTabClick('Tab 2')}
                                    />
                                </div>
                                <div className="p-4">
                                    {activeTab === 'Tab 1' &&
                                        <div>
                                            <textarea
                                                defaultValue={urlArray}
                                                rows={4}
                                                type="text"
                                                onChange={(e) => handleURL(e)}
                                                placeholder="Enter a manual url ... "
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
                                                    ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 bg-slate-100
                                                    focus:ring-[1px] focus:ring-green-500 sm:text-md sm:leading-6
                                                    p-1 pl-3"
                                            />
                                        </div>}

                                    {activeTab === 'Tab 2' &&
                                        <div>
                                            <textarea
                                                defaultValue={urlArray1}
                                                rows={4}
                                                type="text"
                                                onChange={(e) => handleURL1(e)}
                                                placeholder="Enter a sitemap url ... "
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
                                                    ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 bg-slate-100
                                                    focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6
                                                    p-1 pl-3"
                                            />
                                        </div>}
                                </div>
                            </div>
                        </header>
                    </div>
                </div>
            </div>

            <div className='py-4 px-8'>
                <div className='flex flex-col gap-5'>
                    <div className='relative'>
                        <div className='flex justify-between px-4'>
                            <div className='flex gap-6 items-center justify-center'>
                                <div className="block text-lg font-bold leading-6 text-gray-900">
                                    CRAWLED CONTENT: {crawlContent.length}
                                </div>
                                <div className=' text-green-500 font-bold text-lg'>
                                    {
                                        urlArray &&
                                        <div>
                                            {urlArray[currentPage - 1]}
                                        </div>
                                    }
                                    {
                                        urlArray1 &&
                                        <div>
                                            {urlArray1[currentPage - 1]}
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className='flex gap-2 justify-between'>
                                <button
                                    className={` ${currentItem ? "disabled" : "text-green-500"} border-[1px] border-indigo-600 float-right rounded bg-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-sm hover:bg-white hover:text-indigo-600 hover:curosr-pointer focus-visible:outline focus-visible:outline-2  focus-visible:outline-offset-2 focus-visible:outline-indigo-500  `}
                                    onClick={saveContent}
                                >
                                    Save
                                </button>

                                <button
                                    className="border-[1px] border-indigo-600 float-right rounded bg-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-sm hover:bg-white hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                >
                                    Suggestion
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 h-[200px] overflow-y-auto overflow-x-auto bg-slate-100 w-full border-[1px] rounded-lg py-3 px-6 border-gray-300">
                            <div className='p-2 px-6'>
                                <pre className='w-full whitespace-pre-wrap'>
                                    <code className='javascript-language w-full'>
                                        {currentItem.map((item, index) => (
                                            <div key={index} className=' '>
                                                <div className=''>
                                                    {formatHTML(item)}
                                                </div>
                                            </div>
                                        ))}
                                    </code>
                                </pre>
                            </div>
                        </div>

                        <div className='absolute top-[50%] px-4 w-full flex justify-between'>
                            <button onClick={handlePrevPage} disabled={currentPage === 1}>
                                <ArrowLeftCircleIcon className='w-6 h-6 text-green-500 hover:cursor-pointer hover:text-indigo-600' />
                            </button>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                                <ArrowRightCircleIcon className='w-6 h-6 text-green-500 hover:cursor-pointer hover:text-indigo-600' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='py-4 px-8'>
                <div className='flex flex-col gap-5'>
                    <div>
                        <div className='flex justify-between px-4'>
                            <div className="block text-lg font-bold leading-6 text-gray-900">
                                AI SUGGESTION FOR SEO OPTIMIZATION:
                            </div>
                            <button
                                className="border-[1px] border-indigo-600 float-right rounded bg-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-sm hover:bg-white hover:text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                                Save
                            </button>
                        </div>
                        <div className="mt-2">
                            <textarea
                                rows={6}
                                type="text"
                                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm 
                                ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-md sm:leading-6
                                p-1 pl-3 resize-none'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default URLChecker
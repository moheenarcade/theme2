'use client';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { IoClose } from "react-icons/io5";
import { IoStar } from "react-icons/io5";

const reviews = [
    {
        name: 'Sarah M.',
        review: 'Absolutely love this product! It changed my skincare routine forever.',
        rating: 5,
    },
    {
        name: 'John D.',
        review: 'Great value for money and fast shipping. Highly recommend!',
        rating: 4,
    },
    {
        name: 'Aisha R.',
        review: 'Impressed by the quality. Will definitely order again.',
        rating: 5,
    },
    {
        name: 'Aisha R.',
        review: 'Impressed by the quality. Will definitely order again.',
        rating: 4,
    },
    {
        name: 'Aisha R.',
        review: 'Impressed by the quality. Will definitely order again. Impressed by the quality. Will definitely order again. Impressed by the quality. Will definitely order again.',
        rating: 5,
    },
];

const Customerreviews = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [selectedImages, setSelectedImages] = useState([]);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        comment: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        firstName: '',
        rating: '',
        comment: ''
    });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = files.map(file => URL.createObjectURL(file));
            setSelectedImages(prev => [...prev, ...newImages]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            email: '',
            firstName: '',
            rating: '',
            comment: ''
        };

        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (!formData.firstName) {
            newErrors.firstName = 'First name is required';
            isValid = false;
        }

        if (selectedRating === 0) {
            newErrors.rating = 'Please select a rating';
            isValid = false;
        }

        if (!formData.comment) {
            newErrors.comment = 'Comment is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log({
                ...formData,
                rating: selectedRating,
                images: selectedImages
            });

            // Reset form
            setFormData({
                email: '',
                firstName: '',
                lastName: '',
                comment: ''
            });
            setSelectedRating(0);
            setSelectedImages([]);
            setErrors({
                email: '',
                firstName: '',
                rating: '',
                comment: ''
            });
            setShowModal(false);
        }
    };

    const closeModal = () => {
        selectedImages.forEach(image => URL.revokeObjectURL(image));
        setSelectedImages([]);
        setShowModal(false);
    };

    return (
        <>
            <div className='reviews-main'>
                <div className="max-w-[1125px] mx-auto px-4 xl:px-0 py-[30px]">
                    <div className="mb-4 md:mb-6">
                        <h2 className='text-[#000000] text-[22px] md:text-[26px] text-center'>
                            Customer review
                        </h2>
                        <p className='text-[#696969] text-center'>Add your rating</p>
                    </div>

                    <div className="adding-rating flex flex-col md:flex-row items-center justify-between" >
                        <h3 className='font-[500] text-xl'>Customer review</h3>
                        <button onClick={() => setShowModal(true)} className='bg-[#592404] mt-2 md:mt-0 w-fit hover:bg-white hover:text-[#592404] hover:border-[#592404] py-[8px] px-4 md:px-[24px] cursor-pointer text-white border-[#FFFFFFFF] border-[1px] font-[500] rounded-[3px] transition-all duration-[0.3s] ease-in-out'>
                            Add your rating
                        </button>
                    </div>
                    <div className="reviews-slider mt-8">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={3}
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 5000 }}
                            loop={true}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1,
                                },
                                640: {
                                    slidesPerView: 2,
                                },
                                1024: {
                                    slidesPerView: 3,
                                },
                            }}
                        >
                            {reviews.map((review, index) => (
                                <SwiperSlide key={index}>
                                    <div className="single-review rounded-[3px] border-[#f0f0f0] border-[1px] p-6 text-center">
                                        <p className="text-gray-800 text-lg mb-4 italic line-clamp-2">"{review.review}"</p>
                                        <div className="flex justify-center gap-1 mb-2">
                                            {Array(review.rating)
                                                .fill(0)
                                                .map((_, i) => (
                                                    <span key={i} className="text-yellow-400 text-xl">★</span>
                                                ))}
                                            {Array(5 - review.rating)
                                                .fill(0)
                                                .map((_, i) => (
                                                    <span key={i} className="text-[#FFAB00] text-xl">★</span>
                                                ))}
                                        </div>
                                        <p className="text-gray-600 font-medium mb-4">– {review.name}</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed overflow-y-auto py-20 inset-0 z-50 flex items-center justify-center bg-[#000000d9] bg-opacity-60">
                    <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-lg">
                        <div className="flex justify-between items-center px-6 py-4 border-b-[#f0f0f0] border-b-[1px]">
                            <h3 className="text-xl font-[600]">Add Your Rating</h3>
                            <button onClick={closeModal} className="cursor-pointer hover:scale-[1.2] transition-all duration-[0.3s] ease-in-out">
                                <IoClose className='text-2xl' />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="reviews-form mb-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="w-full mb-2">
                                        <input
                                            className={`w-full py-[10px] px-[15px] border-[#e5e5e5] border-[1px] rounded-[3px] ${errors.email ? 'border-red-500' : ''}`}
                                            type="email"
                                            name="email"
                                            placeholder='Email'
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-[50%]">
                                            <input
                                                className={`w-full py-[10px] px-[15px] border-[#e5e5e5] border-[1px] rounded-[3px] ${errors.firstName ? 'border-red-500' : ''}`}
                                                type="text"
                                                name="firstName"
                                                placeholder='First Name'
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                            />
                                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                        </div>
                                        <div className="w-[50%]">
                                            <input
                                                className='w-full py-[10px] px-[15px] border-[#e5e5e5] border-[1px] rounded-[3px]'
                                                type="text"
                                                name="lastName"
                                                placeholder='Last Name'
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 mb-4">
                                        <p>Evaluation</p>
                                        <div className="flex gap-[1px] mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <IoStar
                                                    key={star}
                                                    className={`text-2xl cursor-pointer transition-all ${selectedRating >= star ? 'text-[#ffd056]' : 'text-[#d9d9d9]'}`}
                                                    onClick={() => {
                                                        setSelectedRating(star);
                                                        if (errors.rating) {
                                                            setErrors(prev => ({
                                                                ...prev,
                                                                rating: ''
                                                            }));
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
                                    </div>
                                    <div className="">
                                        <textarea
                                            className={`w-full h-[100px] py-[10px] px-[15px] border-[#e5e5e5] border-[1px] rounded-[3px] ${errors.comment ? 'border-red-500' : ''}`}
                                            name="comment"
                                            placeholder='Write a comment'
                                            value={formData.comment}
                                            onChange={handleInputChange}
                                        ></textarea>
                                        {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
                                    </div>
                                    <div className="my-4 relative border-[1px] border-dashed border-[#f0f0f0] min-h-[100px] flex justify-center items-center">
                                        <div className="opacity-0 z-[9999] w-full h-full absolute">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageChange}
                                                className="block w-full h-[100px] text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#f3f3f3] file:text-[#592404]"
                                            />
                                        </div>

                                        {selectedImages.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedImages.map((image, index) => (
                                                    <div key={index} className="relative">
                                                        <img src={image} alt={`Preview ${index}`} className="h-20 object-cover rounded" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedImages(selectedImages.filter((_, i) => i !== index));
                                                                URL.revokeObjectURL(image);
                                                            }}
                                                            className="absolute z-[99999999999] cursor-pointer top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center absolute">
                                                <svg data-v-360d087e="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="image-icon-drag">
                                                    <svg data-v-360d087e="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="image-icon-drag"><path data-v-360d087e="" d="M383.6 229l-.5 1.5.7 1.7c-.2-1.1-.2-2.2-.2-3.2zm-119.7-5.4l-.3 1.4.6 1.3c-.2-.8-.3-1.8-.3-2.7zm62.4 3.8l-.2 1 .5 1.1-.3-2.1z"></path><path data-v-360d087e="" d="M483 326.2l-43.5-100.5c-3.6-8.4-10.3-14.9-18.7-18.4-8.5-3.6-17.8-3.5-26.1.1L391 209c-3.3 1.4-6.1 3.6-8.4 6.3-3.6-8.2-10.2-14.6-18.6-18-8.5-3.4-17.7-3.3-26.1.3-6.1 2.7-10.9 6.8-13.9 12-3.7-8-10.2-14.3-18.4-17.6-8.5-3.4-17.8-3.3-26.1.3l-3.7 1.6c-6.3 2.7-11.2 7.1-14.3 12.4l-20.3-46.9c-4.2-9.8-10.7-16.8-18.7-20.2-8.1-3.5-17.2-3.2-26.5.8l-3.7 1.6c-8 3.5-13.3 9.3-15.5 16.9-2.1 7.3-1 16.2 3.1 25.6l83.4 188.2-64.7-39.8c-11.2-6.8-25.7-4.7-34.4 5.1-11.3 12.5-10.3 31.9 2 43.3l55.8 51.5 50.8 43.4c17.6 16.7 38.2 28.1 59.6 32.9 7.7 1.7 15.5 2.5 23.2 2.5 14.9 0 29.7-3.1 44.2-9.4l27.9-12.1c31.2-13.5 52.8-37.1 62.6-68.4 9.2-29.2 6.6-63-7.3-95.1zM383.6 229c0 1 .1 2.1.2 3.1l-.7-1.7.5-1.4zM281.7 466.6c-.2-.2-.5-.5-.7-.6l-50.4-43.1-55.6-51.5c-7.3-6.7-7.9-18.2-1.2-25.6 4.7-5.3 12.5-6.4 18.5-2.6l65.6 40.2c4.7 2.9 10.4 2.4 14.5-1.3 4.1-3.6 5.3-9.2 3.2-14.2l-83.7-189c-3.2-7.4-3.9-13.4-2.1-18.1 1.7-4.3 5.2-6.5 7.9-7.7l3.7-1.6c12.3-5.3 22.8-.6 28.6 12.9L310.2 350c1.4 3.2 5.1 4.6 8.3 3.3 3.2-1.4 4.7-5.1 3.3-8.3l-48.7-112.5c-2.2-5.2-3-10.8-2-15.4 1.1-5.4 4.5-9.3 9.9-11.7l3.7-1.6c5.3-2.3 11.1-2.3 16.4-.2 5.3 2.2 9.5 6.3 11.8 11.6l43.9 101.5c.7 1.6 1.9 2.7 3.5 3.4 1.6.6 3.3.6 4.8-.1 3.2-1.4 4.7-5.1 3.3-8.3l-32.8-75.9c-8.2-18.9 4.8-25.6 7.5-26.8 10.8-4.7 23.5.4 28.2 11.3l28.9 66.7c1.4 3.2 5.1 4.7 8.3 3.3 3.2-1.4 4.7-5.1 3.3-8.3l-19.4-44.8c-1.3-3-4.9-13.2 3.8-16.9l3.7-1.6c5.2-2.3 11.1-2.3 16.4 0 5.3 2.3 9.6 6.4 11.9 11.8L471.7 331c12.7 29.3 15.1 59.9 6.8 86.3-8.7 27.6-27.9 48.5-55.6 60.5L395 489.9c-38.9 16.9-80.1 8.4-113.3-23.3zm44.6-239.2l.3 2.1-.5-1.1.2-1zm-62.4-3.8l.3 2.7-.6-1.3.3-1.4zM31 217c3.2 0 6-2.6 6-5.7v-40c0-3.2-2.8-5.7-6-5.7s-6 2.6-6 5.7v40c0 3.2 2.8 5.7 6 5.7zm0-66.3c3.2 0 6-2.6 6-5.7v-40c0-3.2-2.8-5.7-6-5.7s-6 2.6-6 5.7v40c0 3.1 2.8 5.7 6 5.7zM148 296h-40c-3.2 0-5.7 2.3-5.7 5.5s2.6 5.5 5.7 5.5h40c3.2 0 5.7-2.3 5.7-5.5s-2.6-5.5-5.7-5.5zM37 237.6c0-3.2-2.8-5.7-6-5.7s-6 2.6-6 5.7v40c0 3.2 2.8 5.7 6 5.7s6-2.6 6-5.7v-40zM31 84.4c3.2 0 6-2.6 6-5.7v-40c0-3.2-2.8-5.7-6-5.7s-6 2.6-6 5.7v40c0 3.1 2.8 5.7 6 5.7zM81.6 296H49.1c-1.7 0-3.4-.6-5-1.3-2.9-1.3-6.3-.1-7.5 2.8-1.3 2.9 0 6.3 2.9 7.5 3 1.3 6.3 2 9.6 2h32.5c3.2 0 5.7-2.3 5.7-5.5s-2.5-5.5-5.7-5.5zm60.6-281c3.2 0 5.7-2.8 5.7-6s-2.6-6-5.7-6h-40c-3.2 0-5.7 2.8-5.7 6s2.6 6 5.7 6h40z"></path><path data-v-360d087e="" d="M323 122.4c-3.2 0-6 2.6-6 5.7v39.2c0 3.2 2.8 5.7 6 5.7s6-2.6 6-5.7v-39.2c0-3.1-2.8-5.7-6-5.7zm6-60.6c0-3.2-2.8-5.7-6-5.7s-6 2.6-6 5.7v40c0 3.2 2.8 5.7 6 5.7s6-2.6 6-5.7v-40zM301.2 15h3.6c6.8 0 12.2 5.6 12.2 12.4v8.1c0 3.2 2.8 5.7 6 5.7s6-2.6 6-5.7v-8.1C329 14.3 317.9 3 304.8 3h-3.6c-3.2 0-5.7 2.8-5.7 6s2.5 6 5.7 6zm-66.3 0h40c3.2 0 5.7-2.8 5.7-6s-2.6-6-5.7-6h-40c-3.2 0-5.7 2.8-5.7 6s2.5 6 5.7 6zm-60.6 292h40c3.2 0 5.7-2.3 5.7-5.5s-2.6-5.5-5.7-5.5h-40c-3.2 0-5.7 2.3-5.7 5.5s2.5 5.5 5.7 5.5zm-5.8-292h40c3.2 0 5.7-2.8 5.7-6s-2.6-6-5.7-6h-40c-3.2 0-5.7 2.8-5.7 6s2.6 6 5.7 6zM37.1 19.8c1.4 0 2.7-.6 3.8-1.5 2.3-2 5.2-3.2 8.2-3.2h26.8c3.2 0 5.7-2.8 5.7-6s-2.6-6-5.7-6H49.1c-5.9 0-11.5 2.5-15.9 6.5-2.3 2.1-2.5 5.9-.4 8.2 1.1 1.2 2.7 2 4.3 2z"></path></svg>
                                                </svg>
                                                <p>Drag the file or click to upload</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end mt-4 border-t-[#f0f0f0] border-t-[1px] pt-4">
                                        <button
                                            type="submit"
                                            className="bg-[#592404] cursor-pointer hover:bg-white hover:text-[#592404] hover:border-[#592404] text-white border border-[#592404] px-4 py-2 rounded transition-all"
                                        >
                                            Save your rating
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Customerreviews;
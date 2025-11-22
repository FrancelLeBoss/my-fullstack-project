import React, { useEffect,useState } from 'react'
import useProduct from '../../hooks/useProduct'
import { BsStarFill } from 'react-icons/bs';
import { BiStar, BiSolidStarHalf } from 'react-icons/bi';

const TopProducts = () => {
    const { topRatedProducts } = useProduct();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    const StarRating = ( rating: number ) : any =>{
        // rating est un nombre (ex: 3.7)
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
            // étoile pleine
            stars.push(<BsStarFill key={i} className="text-yellow-400" />);
            } else if (rating >= i - 0.5) {
            // demi-étoile
            stars.push(<BiSolidStarHalf key={i} className="text-yellow-400" />);
            } else {
            // étoile vide
            stars.push(<BiStar key={i} className="text-yellow-400" />);
            }
        }

        return <div className="flex">{stars}</div>;
        }

  return (
    <div className=""> 
    <div className="container">
        {/* Header section */}
        <div className='text-left mb-24'>
            <p className="text-sm text-primary font-medium" data-aos='fade-up'>Top Rated Products for you</p>
            <h1 className="text-3xl font-bold dark:text-white" data-aos='fade-up'>Best Products</h1>
            <p className="text-xs text-gray-400" data-aos='fade-up'>discover our top-rated products</p>
        </div>
        {/* Body section */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center gap-20 md:gap-5'>
            {
                topRatedProducts.slice(0,3).map((data)=>(
                    <div key={data.id} data-aos = 'zoom-in'
                     className='rounded-2xl bg-white
                    dark:bg-gray-800 hover:bg-black/80
                    dark:hover:bg-primary hover:text-white relative
                    shadow-xl duration-300 group max-w-[300px] mt-14 group'>
                        {/* Image section */}
                        <div className='h-[100px]'>
                            <img src={apiBaseUrl+data.variants[0].images.find(i => i.mainImage)?.image || "/product_fallback_img.png"} alt={data.title} className='max-w-[140px] block mx-auto
                            transform -translate-y-20 group-hover:scale-105 duration-300
                            drop-shadow-md'/>
                        </div>
                        {/* Desc section */}
                        <div className='pb-4 px-8 flex flex-col gap-[1px] items-center mt-4'>
                            <div className='flex gap-1 text-xl items-center '>
                                {StarRating(data.avg_rating)}
                            </div>
                            <h1 className='dark:text-white font-bold text-xl'>{data.title}</h1>
                            <p className='text-sm text-gray-500
                             group-hover:text-white duration-300 
                             line-clamp-2'>
                                {data.short_desc}</p>
                            <button className='bg-primary hover:scale-105
                                    duration-200 text-white py-1 px-4 rounded-xl mt-4
                                    group-hover:bg-white group-hover:text-primary'
                                    onClick={() => window.location.href=`/product/${data.id}/1`}> 
                                    Order now
                                </button>
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
</div>
  )
}

export default TopProducts
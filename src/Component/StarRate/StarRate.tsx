// import styled from "styled-components";
import { useState, useEffect } from "react";

interface prop {
    id: number;
    rate: number;
};

const StarRate = (rate: prop) => {
    const grade = rate.rate;
    const { id } = rate;
    const starIndex = ["1p", "2p", "3p", "4p", "5p"];
    const [rateArr, setRateArr] = useState([0, 0, 0, 0, 0]);

    const calcStarRate = (rate: number) => {
        let tempRateArr = [0, 0, 0, 0, 0];
        for (let i=0; i<5; i++) {
            if (rate - i >= 1) tempRateArr[i] = 1;
            else if (rate - i < 1 && rate - i > 0) tempRateArr[i] = rate-i;
        }
        return tempRateArr;
    };

    useEffect(() => {
        setRateArr(calcStarRate(grade));
    }, [grade, rate]);

    return (
        <span className={`star-rate-${grade}`}>
            {starIndex.map((item: any, i:number) => {
                console.log(rateArr);
                return (
                <span className='star_icon' key={`${id}_${item}_${i}`}>
                    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 14 13' fill='#cacaca'>
                        <clipPath id={`${item}StarClip`}>
                            <rect width={`${rateArr[i]*14}`} height='39' />
                        </clipPath>
                        <path 
                            key={`rate_${id}`} 
                            id={`${item}Star`}
                            d='M9,2l2.163,4.279L16,6.969,12.5,10.3l.826,4.7L9,12.779,4.674,15,5.5,10.3,2,6.969l4.837-.69Z'
                            transform='translate(-2 -2)'
                        />
                        <use clipPath={`url(#${item}StarClip)`} href={`#${item}Star`} fill='#966fd6'
                        />
                    </svg>
                </span>
            )})}
        </span>
    )
}


export default StarRate;
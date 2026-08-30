"use client";

interface HighlightBoxProps {
    title: string;
    value: string;
    description: string;
    valueColor: string;
    descriptionColor: string;
}

export default function HighlightBox({ title, value, description, valueColor, descriptionColor }: HighlightBoxProps) {
    return(
        <div className="bg-white rounded-2xl shadow-md/10 lg:py-4 lg:px-4 w-full max-w-xs">
            <header className="font-bold text-[#94A3B8] text-xs">{title.toUpperCase()}</header>
            <div className="flex items-end lg:gap-x-2">
                <h1 className={`${valueColor} text-base font-bold lg:text-2xl`}>{value}</h1>
                <p className={`${descriptionColor} font-bold text-xs`}>{description}</p>
            </div>
        </div>
    )
}
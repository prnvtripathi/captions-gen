import { WandSparkles } from 'lucide-react';

export default function DemoSection() {
    return (
        <section className="mt-10">
            <div className="flex justify-around items-center">
                <div className="w-[30rem] h-[45rem] mx-auto bg-gray-800/50 rounded-xl"></div>
                <WandSparkles size={54} color="#fff" strokeWidth={1.25} className="icon-animation" />
                <div className="w-[30rem] h-[45rem] mx-auto bg-gray-800/50 rounded-xl"></div>
            </div>
        </section>
    );
}
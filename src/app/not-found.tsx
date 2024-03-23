import dynamic from "next/dynamic";
export default function NotFound() {
    let NotFound = dynamic(() => import('./component/NotFound'), { ssr: false });
    return (
        <main>
            <NotFound />
        </main>
    )
}
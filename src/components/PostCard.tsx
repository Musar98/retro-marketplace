import Image from "next/image";

type Post = {
    id: string
    title: string
    content: string
    images?: string[]
    type: 'BUY' | 'SELL' | 'LOOKING'
}

interface Props {
    post: Post
}

export default function PostCard({ post }: Props) {
    return (
        <div className="">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            {post.images?.map((img, i) => (
                <Image key={i} src={img} alt="" />
            ))}
            <p className="text-xs mt-2">Type: {post.type}</p>
        </div>
    )
}

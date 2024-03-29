import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Head } from 'next/document'

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { usePlayer } from '../../contexts/PlayerContext'

import api from '../../services/api'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

import styles from './styles.module.scss'

type Episode = {
	id: string
	title: string
	members: string
	publishedAt: string
	thumbnail: string
	duration: number
    url: string
	durationAsString: string
    description: string
}

type EpisodeProps = {
    episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
    const { playEpisode } = usePlayer()

    return (
        <div className={styles.episode}>
            <Head>
				<title>{episode.title}</title>
			</Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/images/arrow-left.svg" alt="Go back"/>
                    </button>
                </Link>
                <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" />
                <button type="button" onClick={() => playEpisode(episode)}>
                    <img src="/images/play.svg" alt="Play episode"/>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div 
                className={styles.description} 
                dangerouslySetInnerHTML={{ __html: episode.description }} 
            />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params

    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
            locale: ptBR
        }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url
    }

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24 // 24 hours
    }
}
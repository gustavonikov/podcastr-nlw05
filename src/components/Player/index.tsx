import Image from 'next/image'
import React, { ReactElement, useContext, useEffect, useRef } from 'react'
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css' 

import { PlayerContext } from '../../contexts/PlayerContext'
import styles from './styles.module.scss'

export default function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)

    const { episodeList, currentEpisodeIndex, isPlaying, toggleEpisode, setPlayingState } = useContext(PlayerContext)

    useEffect(() => {
        if (!audioRef.current) {
            return
        }

        if (isPlaying) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying])

    const episode = episodeList[currentEpisodeIndex]

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/images/playing.svg" alt="Playing now" />
                <strong>Tocando agora</strong>
            </header>

            {
                episode ?
                    (
                        <div className={styles.currentEpisode}>
                            <Image
                                width={592}
                                height={592}
                                src={episode.thumbnail}
                                objectFit="cover"
                            />
                            <strong>{episode.title}</strong>
                            <span>{episode.members}</span>
                        </div>
                    )
                    :
                    (
                        <div className={styles.emptyPlayer}>
                            <strong>Selecione um podcast para ouvir</strong>
                        </div>
                    )
            }
            
            <footer className={episode && styles.empty}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        {
                            episode ?
                            (
                                <Slider 
                                    trackStyle={{ backgroundColor: '#04d361' }} 
                                    railStyle={{ backgroundColor: '#9f75ff' }}
                                    handleStyle={{ borderColor: '#04d361', borderWidth: 4}}
                                />
                            )
                            :
                            <div className={styles.emptySlider} />
                        }
                    </div>
                    <span>00:00</span>
                </div>

                {
                    episode &&
                    (
                        <audio
                            src={episode.url}
                            autoPlay
                            ref={audioRef}
                            onPlay={() => setPlayingState(true)}
                            onPause={() => setPlayingState(false)}
                        />
                    )
                }

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/images/shuffle.svg" alt="Shuffle"/>
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/images/play-previous.svg" alt="Play previous podcast"/>
                    </button>
                    <button 
                        type="button" 
                        className={styles.playButton} 
                        disabled={!episode}
                        onClick={toggleEpisode}
                    >
                        {
                            isPlaying ?
                                <img src="/images/play.svg" alt="Play podcast"/>
                                :
                                <img src="/images/pause.svg" alt="Pause podcast"/>
                        }
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/images/play-next.svg" alt="Play next podcast"/>
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/images/repeat.svg" alt="Repeat podcast"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css' 

import { usePlayer } from '../../contexts/PlayerContext'
import styles from './styles.module.scss'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

export default function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress, setProgress] = useState(0)

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        toggleEpisode, 
        setPlayingState,
        playNextEpisode,
        playPreviousEpisode,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        clearPlayerState
    } = usePlayer()

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

    function setupProgressListener() {
        audioRef.current.currentTime = 0

        audioRef.current.addEventListener('timeupdate', event => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleProgressOnSlider(duration: number) {
        audioRef.current.currentTime = duration

        setProgress(duration)
    }

    function handleEpisodeEnd() {
        if (hasNext) {
            playNextEpisode()
        } else {
            clearPlayerState()
        }
    }

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
            
            <footer className={episode ? '' : styles.empty}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {
                            episode ?
                            (
                                <Slider 
                                    max={episode.duration}
                                    value={progress}
                                    onChange={handleProgressOnSlider}
                                    trackStyle={{ backgroundColor: '#04d361' }} 
                                    railStyle={{ backgroundColor: '#9f75ff' }}
                                    handleStyle={{ borderColor: '#04d361', borderWidth: 4}}
                                />
                            )
                            :
                            <div className={styles.emptySlider} />
                        }
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration) ?? 0}</span>
                </div>

                {
                    episode &&
                    (
                        <audio
                            src={episode.url}
                            autoPlay
                            ref={audioRef}
                            loop={isLooping}
                            onEnded={handleEpisodeEnd}
                            onPlay={() => setPlayingState(true)}
                            onPause={() => setPlayingState(false)}
                            onLoadedMetadata={setupProgressListener}
                        />
                    )
                }

                <div className={styles.buttons}>
                    <button 
                        type="button" 
                        disabled={!episode || episodeList.length === 1} 
                        onClick={toggleShuffle} 
                        className={isShuffling ? styles.isActive: ''}
                    >
                        <img src="/images/shuffle.svg" alt="Shuffle"/>
                    </button>
                    <button type="button" onClick={playPreviousEpisode} disabled={!episode || !hasPrevious}>
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
                                <img src="/images/pause.svg" alt="Pause podcast"/>
                                :
                                <img src="/images/play.svg" alt="Play podcast"/>
                        }
                    </button>
                    <button type="button" onClick={playNextEpisode} disabled={!episode || !hasNext}>
                        <img src="/images/play-next.svg" alt="Play next podcast"/>
                    </button>
                    <button 
                        type="button" 
                        disabled={!episode} 
                        onClick={toggleLoop} 
                        className={isLooping ? styles.isActive: ''}
                    >
                        <img src="/images/repeat.svg" alt="Repeat podcast"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}

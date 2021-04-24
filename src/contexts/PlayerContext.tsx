import { ReactNode, useContext, useState } from 'react'
import { createContext } from 'react'

type Episode = {
    title: string
    members: string
    thumbnail: string
    duration: number
    url: string
}

type PlayerContextData = {
    episodeList: Episode[]
    currentEpisodeIndex: number
    isPlaying: boolean
    isLooping: boolean
    isShuffling: boolean
    clearPlayerState: () => void
    playEpisode: (episode: Episode) => void
    toggleEpisode: () => void
    toggleLoop: () => void
    toggleShuffle: () => void
    setPlayingState: (state: boolean) => void
    playEpisodesList: (list: Episode[], index: number) => void
    playNextEpisode: () => void
    playPreviousEpisode: () => void
    hasNext: boolean
    hasPrevious: boolean
}

type PlayerContextProviderProps = {
    children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([])
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping, setIsLooping] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)

	function playEpisode(episode: Episode) {
		setEpisodeList([episode])
		setCurrentEpisodeIndex(0)
		setIsPlaying(true)
	}

    function playEpisodesList(list: Episode[], index: number) {
        setEpisodeList(list)
        setCurrentEpisodeIndex(index)
        setIsPlaying(true)
    }

	function toggleEpisode() {
		setIsPlaying(!isPlaying)
	}

    function toggleLoop() {
		setIsLooping(!isLooping)
	}

    function toggleShuffle() {
		setIsShuffling(!isShuffling)
	}

	function setPlayingState(state: boolean) {
		setIsPlaying(state)
	}

    function clearPlayerState() {
        setEpisodeList([])
        setCurrentEpisodeIndex(0)
    }

    const hasPrevious = isShuffling || currentEpisodeIndex > 0
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

    function playNextEpisode() {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            
            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        }
    }

    function playPreviousEpisode() {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            
            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        } else if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        }
    }

    return (
        <PlayerContext.Provider 
			value={{ 
				episodeList, 
				currentEpisodeIndex, 
				isPlaying,
				playEpisode,
				toggleEpisode,
				setPlayingState, 
                playEpisodesList,
                playNextEpisode,
                playPreviousEpisode,
                hasNext,
                hasPrevious,
                isLooping,
                toggleLoop,
                isShuffling,
                toggleShuffle,
                clearPlayerState
			}}
		>
			{children}
		</PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}

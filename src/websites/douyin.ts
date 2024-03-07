import { registerWebSite, Living, PollError, PollErrorType } from '../types'
import { mapFilter } from '~/src/utils'

interface Room {
  cover: {
    url_list: string[]
  };
  room_view_stats: {
    display_version: number;
    display_value: number;
  };
  owner: {
    nickname: string
  };
  title: string;
  link: string
}

interface Item {
  room: Room;
  web_rid: string;
}


interface Response {
  status_code: number
  data: {
    data: Item[]
  }
}

function getInfoFromItem({
  room: {
    cover: {
      url_list
    },
    room_view_stats: {
      display_version,
      display_value,
    },
    owner: {
      nickname,
    },
    title,
  },
  web_rid
}: Item): Living | undefined {
  return {
    title,
    startAt: display_version,
    author: nickname,
    online: display_value,
    preview: url_list[0],
    url: 'https://live.douyin.com/' + web_rid
  }
}

registerWebSite({
  async getLiving() {
    const r = await fetch("https://www.douyin.com/webcast/web/feed/follow/?device_platform=webapp&aid=6383&channel=channel_pc_web&scene=aweme_pc_follow_top&pc_client_type=1&cookie_enabled=true")
    const res: Response = await r.json()

    // not login
    if (res.status_code === 20003) {
      throw new PollError(PollErrorType.NotLogin)
    }
    if (res.data.data.length === 0) {
      throw new PollError(PollErrorType.Other)
    }

    return mapFilter(res.data.data, getInfoFromItem)
  },
  id: 'douyin',
  homepage: 'https://live.douyin.com/'
})

import { copy, writeFile } from '@/autox/get';
import { M3uParser } from 'm3u-parser-generator';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('1234567890abcdef', 10);
export class ParseSource {
  content: string;
  treeData: any;
  constructor(content) {
    content = content + '';
    this.content = content;
    if (content.includes('#EXTM3U')) {
      this.treeData = this.parseByM3u(content);
    } else {
      this.treeData = this.parseContent(content);
    }
  }
  parseContent(content) {
    if (!content) return [];
    try {
      const lines = content
        .split('\n')
        .map(text => text.trim())
        .filter(Boolean);
      // console.log(lines);
      const result = [];
      //
      let currentGroup = null;
      lines.forEach(line => {
        if (line.includes('#genre#')) {
          const groupName = line.split(',').at(0).trim();
          currentGroup = { type: 'group', id: `group-${groupName}-${nanoid()}`, title: groupName, children: [] };
          result.push(currentGroup);
        } else {
          const [channelName, url] = line.split(',').map(text => text.trim());
          const channel = currentGroup.children.find(channel => channel.title == channelName);
          const channelId = `channel-${currentGroup.title}-${channelName}-${nanoid()}`;
          const sourceId = `source-${currentGroup.title}-${channelName}-${url}-${nanoid()}`;
          if (channel) {
            channel.children.push({
              type: 'source',
              id: sourceId,
              title: url,
              value: url,
            });
          } else {
            currentGroup.children.push({
              type: 'channel',
              id: channelId,
              title: channelName,
              children: [
                {
                  type: 'source',
                  id: sourceId,
                  title: url,
                  value: url,
                },
              ],
            });
          }
        }
      });
      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  // 转成data
  parseByM3u(content) {
    // 这是个m3u8文件
    //   [{
    //     "location": "http://[2409:8087:5e01:34::23]:6610/ZTE_CMS/00000001000000060000000000000459/index.m3u8?IAS",
    //     "duration": -1,
    //     "attributes": {
    //         "group-title": "IPV6·4K"
    //     },
    //     "kodiProps": {},
    //     "name": "爱上4K 「IPV6」"
    // }....]
    if (!content) return [];

    try {
      const dataArray = M3uParser.parse(content, true).medias;

      const groupMap = new Map(); // 使用Map存储对应关系

      // 遍历dataArray，构建groupMap
      dataArray.forEach(item => {
        const groupTitle = item.attributes['group-title'];
        const channelName = item.name;
        const location = item.location;

        if (!groupMap.has(groupTitle)) {
          groupMap.set(groupTitle, []);
        }

        const channels = groupMap.get(groupTitle);
        const channel = channels.find(ch => ch.channelName === channelName);

        if (channel) {
          channel.sources.push({
            sourceName: `信源-${channel.sources.length + 1}`,
            url: location,
          });
        } else {
          channels.push({
            groupName: groupTitle,
            channelName: channelName,
            sources: [
              {
                sourceName: `信源-1`,
                url: location,
              },
            ],
          });
        }
      });

      // 转换为数组形式
      const group = Array.from(groupMap, ([groupName, channels]) => ({
        groupName,
        channels,
      }));

      return group;
    } catch (error) {
      return [];
    }
  }

  setAttribute() {
    this.treeData.forEach(group => {
      // 给channel加上group
      group.children.forEach(channel => {
        channel.groupId = group.id;
        // 给source加上group和channel
        channel.children.forEach((source, sources_index) => {
          source.groupId = group.id;
          source.channelId = channel.id;
        });
      });
    });
  }
}

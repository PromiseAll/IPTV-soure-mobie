import { copy, writeFile } from "@/autox/get";
import { M3uParser } from "m3u-parser-generator";
export class ParseSource {
  content: string;
  data: any;
  constructor(content) {
    content = content + "";
    this.content = content;
    if (content.includes("#EXTM3U")) {
      this.data = this.parseByM3u(content);
    } else {
      this.data = this.parseContent(content);
    }

    this.setAttribute();
  }
  parseContent(content) {
    if (!content) return [];
    try {
      const lines = content
        .split("\n")
        .map(text => text.trim())
        .filter(Boolean);
      // console.log(lines);
      const result = [];
      //
      let currentGroup = null;
      lines.forEach(line => {
        if (line.includes("#genre#")) {
          const groupName = line.split(",").at(0).trim();
          currentGroup = { groupName, channels: [] };
          result.push(currentGroup);
        } else {
          const [channelName, url] = line.split(",").map(text => text.trim());
          const channel = currentGroup.channels.find(channel => channel.channelName == channelName);
          if (channel) {
            channel.sources.push({ url });
          } else {
            currentGroup.channels.push({
              channelName,
              sources: [{ url }]
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
        const groupTitle = item.attributes["group-title"];
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
            url: location
          });
        } else {
          channels.push({
            groupName: groupTitle,
            channelName: channelName,
            sources: [{
              sourceName: `信源-1`,
              url: location
            }]
          });
        }
      });

      // 转换为数组形式
      const group = Array.from(groupMap, ([groupName, channels]) => ({
        groupName,
        channels
      }));

      return group;
    } catch (error) {
      return [];
    }
  }

  setAttribute() {
    // 给channel加上group
    this.data.forEach(group => {
      group.channels.forEach(channel => {
        channel.groupName = group.groupName;
      });
    });

    // 给source加上group和channel
    this.data.forEach(group => {
      group.channels.forEach(channel => {
        channel.sources.forEach((source, sources_index) => {
          source.groupName = group.groupName;
          source.channelName = channel.channelName;
          source.sourceName = `信源-${sources_index + 1}`;
        });
      });
    });
  }
  getAllSources() {
    return this.data
      .map(group => {
        return group.channels.map(channel => channel.sources).flat();
      })
      .flat();
  }

  // 删除重复源 使用set去重
  deleteRepeatSources() {
    this.data.forEach(group => {
      group.channels.forEach(channel => {
        channel.sources = [...new Set(channel.sources)];
      });
    });
  }

  // 删除超时源
  deleteTimeoutSources() {
    this.data.forEach(group => {
      group.channels.forEach(channel => {
        channel.sources = channel.sources.filter(source => source.ping != -1);
      });
    });
  }

  // 排序源
  sortSources() {
    this.data.forEach(group => {
      group.channels.forEach(channel => {
        channel.sources.sort((a, b) => {
          // 检测ping并排序 从小到大 -1是超时无限大
          if (a.ping == -1) return 1;
          if (b.ping == -1) return -1;
          return a.ping - b.ping;
        });
      });
    });
  }

  renameGroup(oldName, newName) {
    this.data = this.data.map(group => {
      if (group.groupName == oldName) {
        group.groupName = newName;
      }
      return group;
    });
    this.setAttribute();
  }
  renameChannel(groupName, oldName, newName) {
    this.data.find(group => group.groupName == groupName).channels = this.data
      .find(group => group.groupName == groupName)
      .channels.map(channel => {
        if (channel.channelName == oldName) {
          channel.channelName = newName;
        }
        return channel;
      });
    this.setAttribute();
  }

  addGroup(groupName) {
    this.data.push({ groupName, channels: [] });
  }
  addChannel(groupName, channelName) {
    this.data
      .find(group => group.groupName == groupName)
      .channels.push({
        groupName,
        channelName,
        sources: []
      });
  }

  addSource(groupName, channelName, url) {
    const findChannel = this.data.find(group => group.groupName == groupName).channels.find(channel => channel.channelName == channelName);
    findChannel.sources.push({
      url
    });
    this.setAttribute();
  }

  deleteGroup(groupName) {
    // deleteGroup 不改变data引用 使用slice
    const index = this.data.findIndex(group => group.groupName === groupName);
    if (index !== -1) {
      this.data.splice(index, 1);
    }
  }
  deleteChannel(groupName, channelName) {
    this.data.find(group => group.groupName == groupName).channels = this.data.find(group => group.groupName == groupName).channels.filter(channel => channel.channelName != channelName);
  }
  deleteSource(groupName, channelName, sourceName) {
    const findChannel = this.data.find(group => group.groupName == groupName).channels.find(channel => channel.channelName == channelName);
    console.log(findChannel);
    findChannel.sources = findChannel.sources.filter(source => source.sourceName != sourceName);
  }
  toString() {
    return this.data
      .map(group => {
        // 添加分组
        const currentGroup = group.channels
          .map(channel => {
            return channel.sources.map(source => {
              return `${channel.channelName},${source.url}`;
            });
          })
          .flat();
        currentGroup.unshift(`\n${group.groupName},#genre#\n`);
        return currentGroup;
      })
      .flat()
      .join("\n");
  }
  toCopy() {
    copy(this.toString());
  }
  toDownload(pathName) {
    return writeFile(pathName, this.toString());
  }
}

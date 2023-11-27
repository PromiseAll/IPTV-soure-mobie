export class ParseSource {
  content: string;
  data: any;
  constructor(content) {
    this.content = content;
    this.data = this.parseContent(content);
    this.setAttribute();
  }
  parseContent(content) {
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
    navigator.clipboard.writeText(this.toString());
  }
  toDownload() {
    const blob = new Blob([this.toString()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "source.txt";
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
}

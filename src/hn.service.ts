import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { parse } from 'node-html-parser';

@Injectable()
export class HNService {
  HACKER_NEWS_API = 'https://hacker-news.firebaseio.com/v0';
  HACKER_NEWS_ITEM = 'https://news.ycombinator.com/item?id=';

  private items: NewsItem[] = [];

  getItems() {
    if (this.items.length === 0) {
      this.refreshNews();
    }
    return this.items;
  }

  @Cron('0 */1 * * * *') // every 5 mins
  async refreshNews() {
    const storyIds = await fetch(
      `${this.HACKER_NEWS_API}/topstories.json?limitToFirst=30&orderBy="$priority"`,
    ).then((response) => response.json());
    Promise.all(
      storyIds.map(async (storyId) => await this.requestItem(storyId)),
    ).then((items2) => (this.items = items2));
  }

  async requestItem(id: number) {
    if (this.items.length !== 0) {
      const existed = this.items.find((item) => item.id === id);
      if (existed !== undefined) {
        return existed;
      }
    }
    const fetchResponse = await fetch(
      `${this.HACKER_NEWS_API}/item/${id}.json`,
    );
    const object = await fetchResponse.json();
    return await this.loadOG(object);
  }

  async loadOG(object) {
    if (object.hasOwnProperty('url')) {
      const html = await fetch(object['url'])
        .then((response) => response.text())
        .catch(() => {
          console.error(`Failed fetching ${object['url']}`);
          return null;
        });
      if (!html) {
        return object;
      }
      const dom = parse(html);
      const og = {};
      dom.querySelectorAll("meta[property^='og:']").forEach((meta) => {
        og[meta.getAttribute('property')] = meta.getAttribute('content');
      });
      object['og'] = og;
    }
    console.log(JSON.stringify(object));
    return object;
  }
}

type ItemType = 'story' | 'comment' | 'job' | 'poll' | 'pollopt';

class NewsItem {
  id: number;
  score: number;
  title: string;
  type: ItemType;
  url: string;
}

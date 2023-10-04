import { baseEngineUrl } from '../../rest-api/config';
import {
  IEngine, IPositionAtCenterEl, IStateAnimate,
} from '../../types/interface';
import ApiClass from '../Api/apiClass';

export default class Animation {
  api: ApiClass;

  constructor() {
    this.api = new ApiClass();
  }

  getPositionAtCenter(el: HTMLElement) {
    let top = 0; let left = 0; let width = 0; let
      height = 0;

    if (el !== undefined && el !== null) {
      const rect = el.getBoundingClientRect();
      top = rect.top;
      left = rect.left;
      width = rect.width;
      height = rect.height;
    }
    const obj: IPositionAtCenterEl = {
      x: left + width / 2,
      y: top + height / 2,
    };
    return obj;
  }

  getDistanceBerweenElements(a: HTMLElement | null | undefined, b: HTMLElement | null | undefined) {
    const aPos: IPositionAtCenterEl = this.getPositionAtCenter(a as HTMLElement);
    const bPos: IPositionAtCenterEl = this.getPositionAtCenter(b as HTMLElement);
    return Math.hypot(aPos.x - bPos.x, aPos.y - bPos.y);
  }

  animate(
    car: HTMLElement,
    distance: number,
    animationTime: number,
    btnStartAnimate: HTMLElement,
    btnStopAnimate: HTMLElement,
  ) {
    let start: number | null = null;
    const state: IStateAnimate = {
      id: 0,
    };

    function step(timestep: number) {
      if (!start) start = timestep;
      const time = timestep - start;
      const passed: number = Math.floor(time * (distance / animationTime));
      car.style.transform = `translateX(${Math.min(passed, distance)}px)`;
      if (passed < distance) {
        state.id = window.requestAnimationFrame(step);
        btnStartAnimate?.classList.add('disabled');
        btnStopAnimate?.classList.remove('disabled');
      }
    }
    state.id = window.requestAnimationFrame(step);
    btnStartAnimate?.classList.add('disabled');
    btnStopAnimate?.classList.remove('disabled');
    return state;
  }

  async startEngine(id: string) {
    const obj: IEngine = await this.api.engine(`${baseEngineUrl}?id=${id}&status=started`);
    const time = Math.round(obj.distance / obj.velocity);
    return time;
  }

  async stopEngine(id: string) {
    const obj: IEngine = await this.api.engine(`${baseEngineUrl}?id=${id}&status=stopped`);
    return obj;
  }
}

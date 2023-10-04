import {
  baseEngineUrl, baseGarageUrl, baseWinnersUrl, models, names,
} from '../../rest-api/config';
import {
  ICar,
  ICreateDataParams,
  IDriveStatus,
  IGetCars,
  IRace,
  IRaceWinner,
  IGetWinners,
} from '../../types/interface';
import ApiClass from '../Api/apiClass';
import View from '../View/View';
import Animation from '../Animation/Animation';

export default class App {
  view: View;

  api: ApiClass;

  animation: Animation;

  wrapper: HTMLElement | null;

  garageWrap: HTMLElement | null | undefined;

  winnerWrap: HTMLElement | null | undefined;

  btnNext: HTMLElement | null | undefined;

  btnPrev: HTMLElement | null | undefined;

  garageCount: HTMLElement | null | undefined;

  pageCount: HTMLElement | null | undefined;

  winnersCount: HTMLElement | null | undefined;

  winnerPageCount: HTMLElement | null | undefined;

  btnUpadate: HTMLInputElement | null | undefined;

  objClonItem: ICreateDataParams; // объект машины для сохранения промежуточных результатов

  arrSecondary: ICar[];

  currentPageCarage: number;// текущая страница

  currentPageWinner: number;// текущая страница

  carsPage: number;

  winnersPage: number;

  limit: number; // лимит на странице

  limitWinner: number; // лимит на странице

  totalCars: string; // общее количество машин в гараже

  totalWinner: string; // общее количество машин в гараже

  orderSort: string;

  selectPageWins: boolean;

  constructor() {
    this.view = new View();
    this.api = new ApiClass();
    this.animation = new Animation();
    this.wrapper = document.querySelector('[data-root]');
    this.objClonItem = {
      name: '',
      color: '',
    };
    this.currentPageCarage = 1;
    this.currentPageWinner = 1;
    this.carsPage = 1;
    this.winnersPage = 1;
    this.limit = 7;
    this.limitWinner = 4;
    this.totalCars = '';
    this.totalWinner = '';
    this.arrSecondary = [];
    this.orderSort = 'ASC';
    this.selectPageWins = false;
    this.init();
  }

  async init() {
    const getCars = await this.api.getCars(`${baseGarageUrl}`, String(this.currentPageCarage), String(this.limit)); // default
    this.totalCars = getCars.count;
    this.carsPage = Math.ceil(+this.totalCars / this.limit);
    this.view.renderMain();

    this.garageWrap = this.wrapper?.querySelector('[data-garage]');
    this.garageCount = this.wrapper?.querySelector('[data-garageCount]');
    this.pageCount = this.wrapper?.querySelector('[data-pageCount]');
    this.btnNext = this.wrapper?.querySelector('[ data-next]');
    this.btnPrev = this.wrapper?.querySelector('[ data-prev]');
    this.btnUpadate = this.wrapper?.querySelector('[data-update]');
    this.winnerWrap = this.wrapper?.querySelector('[data-winnersPage]');

    if (+getCars.count <= this.currentPageCarage * this.limit) {
      this.btnNext?.classList.add('disabled');
    }

    this.garageCount!.innerHTML = `Garage ${this.totalCars}`;
    this.pageCount!.innerHTML = `Page ${this.carsPage}`;

    this.garageWrap?.insertAdjacentHTML('afterbegin', this.view.renderGarage(getCars.data));

    this.createCar();
    this.selectCar();
    this.updateCar();
    this.removeCar();
    this.startDrivingBtn();
    this.stopDrivingBtn();
    this.paginationNext();
    this.paginationPrev();
    this.generateCars();
    this.startRace();
    this.stopRace();
    this.switchTabWinner();
    this.switchTabGarage();
  }

  setCreateNameCar(param: HTMLInputElement | null | undefined) {
    param?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const value = target?.value;
      this.objClonItem.name = value;
    });
  }

  setCreateColorCar(param: HTMLInputElement | null | undefined) {
    param?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const value = target?.value;
      this.objClonItem.color = value;
    });
  }

  cleanContent(wrap: HTMLElement | null | undefined, arr: ICar[]) {
    (wrap as Element).innerHTML = '';
    (wrap as Element)?.insertAdjacentHTML('afterbegin', this.view.renderGarage(arr));
    this.selectCar();
    this.updateCar();
    this.removeCar();
    this.startDrivingBtn();
    this.stopDrivingBtn();
  }

  selectCar() {
    const btnSelect: NodeList | null | undefined = this.garageWrap?.querySelectorAll('[data-select]');
    const inputUpdate: HTMLInputElement | null | undefined = this.wrapper?.querySelector('input[name="updateName"]');
    const inputColor: HTMLInputElement | null | undefined = this.wrapper?.querySelector('input[name="colorUpdate"]');

    btnSelect?.forEach((item) => {
      item.addEventListener('click', async (e) => {
        this.btnUpadate?.classList.remove('disabled');
        const target = e.target as HTMLElement;
        const attr = target?.dataset.select;
        this.objClonItem.id = attr;
        const itemCar = await this.api.getItemCar(`${baseGarageUrl}/${attr}`);
        inputUpdate!.value = itemCar.name;
        inputColor!.value = itemCar.color;
        inputUpdate?.focus();
      });
    });
  }

  createCar() {
    const btnCreate: HTMLInputElement | null | undefined = this.wrapper?.querySelector('[data-create]');
    const inputCreate: HTMLInputElement | null | undefined = this.wrapper?.querySelector('input[name="createName"]');
    const inputColor: HTMLInputElement | null | undefined = this.wrapper?.querySelector('input[name="color"]');
    this.setCreateNameCar(inputCreate);
    this.setCreateColorCar(inputColor);
    btnCreate?.addEventListener('click', async () => {
      this.api.post(`${baseGarageUrl}`, {
        name: this.objClonItem.name,
        color: this.objClonItem.color,
      });
      const items = await this.api.getCars(`${baseGarageUrl}`, String(this.currentPageCarage), String(this.limit));
      this.updateCountPageAndGarage(items);
      this.cleanContent(this.garageWrap, items.data);
      this.updateGarage(this.currentPageCarage, items);
    });
  }

  updateCar() {
    const inputUpdate: HTMLInputElement | null | undefined = this.wrapper?.querySelector('input[name="updateName"]');
    const inputColor: HTMLInputElement | null | undefined = this.wrapper?.querySelector('input[name="colorUpdate"]');

    this.btnUpadate?.addEventListener('click', async () => {
      this.objClonItem.name = inputUpdate!.value;
      this.objClonItem.color = inputColor!.value;
      await this.api.put(`${baseGarageUrl}/${this.objClonItem.id}`, {
        name: this.objClonItem.name,
        color: this.objClonItem.color,
      });
      const items = await this.api.getCars(`${baseGarageUrl}`, String(this.currentPageCarage), String(this.limit));
      this.cleanContent(this.garageWrap, items.data);
    });
  }

  removeCar() {
    const btnRemove: NodeList | null | undefined = this.garageWrap?.querySelectorAll('[data-remove]');

    btnRemove?.forEach((item) => {
      item.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        const attr = target?.dataset.remove;
        this.objClonItem.id = attr;
        await this.api.delete(`${baseGarageUrl}/${this.objClonItem.id}`);
        const items = await this.api.getCars(`${baseGarageUrl}`, String(this.currentPageCarage), String(this.limit));
        const winners = await this.api.getWinners(`${baseWinnersUrl}`, String(this.currentPageWinner), String(this.limitWinner));
        const findWinner = winners.data.find((el) => String(el.id) === String(this.objClonItem.id));
        if (findWinner !== undefined) {
          await this.api.delete(`${baseWinnersUrl}/${findWinner.id}`);
          await this.api.getWinners(`${baseWinnersUrl}`, String(this.currentPageWinner), String(this.limitWinner));
        }
        this.updateCountPageAndGarage(items);
        this.cleanContent(this.garageWrap, items.data);
        this.updateGarage(this.currentPageCarage, items);
      });
    });
  }

  async startDrivingBtn() {
    const btnStart: NodeList | null | undefined = this.garageWrap?.querySelectorAll('[data-start]');
    btnStart?.forEach((item) => {
      item.addEventListener('click', async (e) => {
        const target = e.target as HTMLInputElement;
        const attr = target?.dataset.start;
        if (attr) this.startDriving(attr);
      });
    });
  }

  async stopDrivingBtn() {
    const btnStop: NodeList | null | undefined = this.garageWrap?.querySelectorAll('[data-stop]');
    btnStop?.forEach((item) => {
      item.addEventListener('click', async (e) => {
        const target = e.target as HTMLInputElement;
        const attr = target.dataset.stop;
        if (attr) this.stopDriving(attr);
      });
    });
  }

  async startDriving(id: string) {
    const btnStart: HTMLElement | null | undefined = this.garageWrap?.querySelector(`[data-start="${id}"]`);
    const btnStop: HTMLElement | null | undefined = this.garageWrap?.querySelector(`[data-stop="${id}"]`);
    const time = await this.animation.startEngine(`${id}`); // время
    const car = this.garageWrap?.querySelector(`[data-car="${id}"]`);
    const flag = this.garageWrap?.querySelector(`[data-flag="${id}"]`);
    const distance: number = Math.floor(this.animation.getDistanceBerweenElements(
      car as HTMLElement,
      flag as HTMLElement,
    )) + 100;
    const state = this.animation.animate(
      car as HTMLElement,
      distance,
      time,
      btnStart as HTMLElement,
      btnStop as HTMLElement,
    );
    const obj: IDriveStatus = await this.api.drive(`${baseEngineUrl}?id=${id}&status=drive`);
    if ((!obj.success)) {
      window.cancelAnimationFrame(state.id);
      (btnStart as HTMLElement).classList.add('disabled');
    }

    const objRace: IRace = {
      success: obj.success,
      time,
      id,
    };
    return objRace;
  }

  async stopDriving(id: string) {
    const btnStop: HTMLElement | null | undefined = this.garageWrap?.querySelector(`[data-stop="${id}"]`);
    const btnStart: HTMLElement | null | undefined = this.garageWrap?.querySelector(`[data-start="${id}"]`);
    await this.animation.stopEngine(`${id}`);
    const car = this.garageWrap?.querySelector(`[data-car="${id}"]`);
    (car as HTMLElement).style.transform = 'translateX(0)';
    (btnStart as HTMLElement).classList.remove('disabled');
    (btnStop as HTMLElement).classList.add('disabled');
  }

  updateGarage(currentPage: number, items: IGetCars) {
    if (items.count) {
      if (currentPage * this.limit < +items.count) {
        (this.btnNext as HTMLElement).classList.remove('disabled');
        (this.btnPrev as HTMLElement).classList.remove('disabled');
      } else {
        (this.btnNext as HTMLElement).classList.add('disabled');
      }
    }

    if (this.currentPageCarage > 1) {
      (this.btnPrev as HTMLElement).classList.remove('disabled');
    } else {
      (this.btnPrev as HTMLElement).classList.add('disabled');
    }
  }

  updateWinners(currentPage: number, items: IGetWinners) {
    if (items.count) {
      if (currentPage * this.limitWinner < +items.count) {
        (this.btnNext as HTMLElement).classList.remove('disabled');
        (this.btnPrev as HTMLElement).classList.remove('disabled');
      } else {
        (this.btnNext as HTMLElement).classList.add('disabled');
      }
    }

    if (this.currentPageWinner > 1) {
      (this.btnPrev as HTMLElement).classList.remove('disabled');
    } else {
      (this.btnPrev as HTMLElement).classList.add('disabled');
    }
  }

  paginationNext() {
    this.btnNext?.addEventListener('click', async () => {
      if (this.selectPageWins) {
        this.currentPageWinner += 1;
        this.winnerWrap!.innerHTML = '';
        this.getWinnersPage();
      } else {
        this.currentPageCarage += 1;
        const items = await this.api.getCars(`${baseGarageUrl}`, `${this.currentPageCarage}`, String(this.limit));
        this.cleanContent(this.garageWrap, items.data);
        this.updateGarage(this.currentPageCarage, items);
        this.startDrivingBtn();
        this.stopDrivingBtn();
      }
    });
  }

  paginationPrev() {
    this.btnPrev?.addEventListener('click', async () => {
      if (this.selectPageWins) {
        this.currentPageWinner -= 1;
        this.winnerWrap!.innerHTML = '';
        this.getWinnersPage();
      } else {
        this.currentPageCarage -= 1;
        const items = await this.api.getCars(`${baseGarageUrl}`, `${this.currentPageCarage}`, String(this.limit));
        this.cleanContent(this.garageWrap, items.data);
        this.updateGarage(this.currentPageCarage, items);
        this.startDrivingBtn();
        this.stopDrivingBtn();
      }
    });
  }

  getRandomName() {
    const model = models[Math.floor(Math.random() * models.length)];
    const name = names[Math.floor(Math.random() * models.length)];
    return `${model} ${name}`;
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i += 1) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  generateRandomCars(count = 100) {
    const obj = Array.from({ length: count }, () => ({
      name: this.getRandomName(),
      color: this.getRandomColor(),
    }));
    return obj;
  }

  updateCountPageAndGarage(items: IGetCars) {
    this.totalCars = items.count;
    this.garageCount!.innerHTML = `Garage ${this.totalCars}`;
    this.carsPage = Math.ceil(+this.totalCars / this.limit);
    this.pageCount!.innerHTML = `Page ${this.carsPage}`;
  }

  /* Рандомные машины 100 */
  generateCars() {
    const btnGenerate: HTMLElement | null | undefined = this.wrapper?.querySelector('[data-generate]');
    const cars = this.generateRandomCars(100);
    btnGenerate?.addEventListener('click', async () => {
      await Promise.all(cars.map((item) => {
        this.api.post(`${baseGarageUrl}`, {
          name: item.name,
          color: item.color,
        });
      }));
      const items: IGetCars = await this.api.getCars(
        `${baseGarageUrl}`,
        String(this.currentPageCarage),
        String(this.limit),
      );
      this.updateCountPageAndGarage(items);
      this.cleanContent(this.garageWrap, items.data);
      this.updateGarage(this.currentPageCarage, items);
    });
  }

  async raceAll(promises: Promise<IRace>[], items: ICar[], ids: string[]): Promise<IRaceWinner> {
    const obj: IRace = await Promise.race(promises);
    if (obj && !obj.success) {
      const failIndex = ids.findIndex((item) => item === obj.id);
      const restPromises = promises.filter((element, index) => {
        if (index !== failIndex) return element;
      });
      const restIds = [...ids.slice(0, failIndex), ...ids.slice(failIndex + 1, ids.length)];
      return this.raceAll(restPromises, items, restIds);
    }
    const car = items.find((item) => item.id === obj.id);
    let winnerCar: IRaceWinner = {
      name: '',
      success: true,
      time: 0,
      id: '',
    };
    if (car) {
      winnerCar = {
        name: car.name,
        success: obj.success,
        time: +(obj.time / 1000).toFixed(2),
        id: car.id,
      };
    }

    return winnerCar;
  }

  async raceCar() {
    const items = await this.api.getCars(`${baseGarageUrl}`, String(this.currentPageCarage), String(this.limit));
    this.arrSecondary = items.data;
    const promises = this.arrSecondary.map((el) => this.startDriving(el.id));
    const winner = await this.raceAll(
      promises,
      this.arrSecondary,
      this.arrSecondary.map((car) => car.id),
    );
    return winner;
  }

  startRace() {
    const btnRace: HTMLElement | null | undefined = this.wrapper?.querySelector('[data-race]');
    const message: HTMLElement | null | undefined = this.wrapper?.querySelector('[data-message]');
    btnRace?.addEventListener('click', async (e) => {
      const target = e.target as HTMLInputElement;
      const winner = await this.raceCar();
      const getWinners = await this.api.getWinners(`${baseWinnersUrl}`, '', '');
      const findWinner = getWinners.data.find((el) => el.id === winner.id);
      if (findWinner === undefined) {
        this.api.post(`${baseWinnersUrl}`, {
          time: winner.time,
          id: winner.id,
          wins: 1,
        });
      } else {
        this.api.put(`${baseWinnersUrl}/${findWinner.id}`, {
          time: (winner.time < findWinner.time) ? winner.time : findWinner.time,
          wins: findWinner.wins + 1,
        });
      }

      message!.innerHTML = `${winner.name} went first ${winner.time} s`;
      message!.classList.add('visible');
      target.classList.add('disabled');
    });
  }

  stopRace() {
    const btnRace: HTMLElement | null | undefined = this.wrapper?.querySelector('[data-race]');
    const btnReset: HTMLElement | null | undefined = this.wrapper?.querySelector('[data-reset]');
    const message: HTMLElement | null | undefined = this.wrapper?.querySelector('[data-message]');
    btnReset?.addEventListener('click', async () => {
      this.arrSecondary.map((el) => this.stopDriving(el.id));
      message!.classList.remove('visible');
      btnRace?.classList.remove('disabled');
    });
  }

  /* Get Winners */
  async getWinnersPage() {
    const garagePage: HTMLElement | null | undefined = this.wrapper?.querySelector('[data-garagePage]');
    const getWinners = await this.api.getWinners(
      `${baseWinnersUrl}`,
      String(this.currentPageWinner),
      String(this.limitWinner),
    ); // default
    const getCars = await this.api.getCars(`${baseGarageUrl}`, '', ''); // default
    this.totalWinner = getWinners.count;
    this.winnersPage = Math.ceil(+this.totalWinner / this.limitWinner);

    this.winnerWrap?.insertAdjacentHTML('afterbegin', this.view.renderWinners(getWinners.data, getCars.data));
    this.winnerWrap?.classList.remove('hidden');
    this.winnersCount = this.winnerWrap?.querySelector('[data-winnerCount]');
    this.winnerPageCount = this.winnerWrap?.querySelector('[data-winnerPageCount]');

    this.winnersCount!.innerHTML = `Winners ${this.totalWinner}`;
    this.winnerPageCount!.innerHTML = `Page ${this.winnersPage}`;

    garagePage?.classList.add('hidden');
    this.selectPageWins = true;
    this.updateWinners(this.currentPageWinner, getWinners);
    this.winnerWrap?.addEventListener('click', async (e) => {
      if ((e.target as HTMLElement).matches('[data-wins]')) this.sortElement('wins');
      if ((e.target as HTMLElement).matches('[data-time]')) this.sortElement('time');
    });
  }

  async getGaragePage() {
    this.init();
  }

  switchTabWinner() {
    const winner: HTMLElement | null | undefined = this.wrapper?.querySelector('[data-switchWinner]');
    winner?.addEventListener('click', (e) => {
      this.getWinnersPage();
      (e.target as HTMLInputElement).classList.add('disabled');
    });
  }

  switchTabGarage() {
    const garage: HTMLElement | null | undefined = this.wrapper?.querySelector('[data-switchGarage]');
    garage?.addEventListener('click', (e) => {
      this.getGaragePage();
      this.selectPageWins = false;
      (e.target as HTMLInputElement).classList.add('disabled');
    });
  }

  getSortOrder(order: string, sort: string) {
    if (order && sort) {
      return `&_sort=${sort}&_order=${order}`;
    }
    return '';
  }

  setSortOrder() {
    if (this.orderSort === 'ASC') {
      this.orderSort = 'DESC';
    } else {
      this.orderSort = 'ASC';
    }
    return this.orderSort;
  }

  async sortElement(order: string) {
    const sortElements = await this.api.getWinners(
      `${baseWinnersUrl}?${this.getSortOrder(this.setSortOrder(), order)}`,
      String(this.currentPageWinner),
      String(this.limitWinner),
    );
    const getCars = await this.api.getCars(`${baseGarageUrl}`, '', '');
    this.winnerWrap!.innerHTML = '';
    this.winnerWrap?.insertAdjacentHTML('afterbegin', this.view.renderWinners(sortElements.data, getCars.data));
  }
}

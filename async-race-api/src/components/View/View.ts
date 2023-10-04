import { ICar, IWinner } from '../../types/interface';

export default class View {
  renderCarImage(color: string) {
    return `<svg>
     <use class="car-icon" xlink:href="assets/icons/sprite.svg#icon1" style="fill: ${color}"></use>
     </svg>`;
  }

  renderGarage(cars: ICar[]) {
    let html = '';
    cars.map((item: ICar) => {
      html += `
        <div class="road" data-road = "${item.id}">
        <div class="road__btn">
            <button type="button" class="btn btn_sml btn_orange road__margin" data-select="${item.id}">Select</button>
            <button type="button" class="btn btn_sml btn_orange road__margin" data-remove = "${item.id}">Remove</button>
            <span class="road__name" style="color:${item.color}">${item.name}</span>
        </div>
        <div class="road__desc">
            <div class="road__start">
                <div class="road__panel">
                    <button type="button" class="btn btn_sml btn_green" data-start="${item.id}">A</button>
                    <button type="button" class="btn btn_sml btn_red disabled" data-stop="${item.id}">B</button>
                </div>
                <div class="car" data-car="${item.id}">${this.renderCarImage(item.color)}</div>
            </div>
            <div class="road__flag" data-flag ="${item.id}">
            <svg>
                <use xlink:href="assets/icons/sprite.svg#icon2"></use>
            </svg>
            </div>
        </div>
        </div>`;
    });
    return html;
  }

  renderWinnerItem(winners: IWinner[], cars: ICar[]) {
    let html = '';
    winners.map((item: IWinner, index) => {
      const car = cars.find((el) => el.id === item.id);
      let color = '';
      if (car) color = car.color;
      html += `
             <tr>
                    <td class="table__td">${index + 1}</td>
                    <td class="table__td">${this.renderCarImage(color)}</td>
                    <td class="table__td">${car?.name}</td>
                    <td class="table__td">${item.wins}</td>
                    <td class="table__td">${item.time}</td>
                </tr>     
         `;
    });
    return html;
  }

  renderWinners(winners: IWinner[], cars: ICar[]) {
    let html = '';
    html = `<h1 class="heading" data-winnerCount>Winners</h1>
         <h2 class="heading" data-winnerPageCount>Page</h2>          
         <table class="table" cellspacing="0"  border = "0" cellpadding="0">
            <thead>
             <th class="table__th">Number</th>
             <th class="table__th">Car</th>
             <th class="table__th">Name</th>
             <th class="table__th table__th_interactive" data-wins>Wins</th>
             <th class="table__th table__th_interactive" data-time>Time</th>
            </thead>
            <tbody>${this.renderWinnerItem(winners, cars)} </tbody>         
            </table>  `;
    return html;
  }

  renderMain() {
    const str = `
        <div class="menu">
            <button type="button" class="btn menu__margin btn_blue" data-switchGarage>To garage</button>
            <button type="button" class="btn btn_green" data-switchWinner>To winners</button>    
        </div>
        <section class="garage" data-garagePage>
            <div class="garage__form">
                <form class="form">
                    <input type="text" name="createName" class="form__input form__margin">
                    <input type="color" name="color" class="form__margin" value="#f7f3f3">
                    <button type="submit" class="btn btn_sml" data-create>create</button>
                </form> 
                 <form class="form">
                    <input type="text" name="updateName" class="form__input form__margin" >
                    <input type="color" name="colorUpdate" class="form__margin" value="#f7f3f3">
                    <button type="submit" class="btn btn_sml btn_orange disabled" data-update>Update</button>
                </form>     
            </div>
            <div class="garage__control">
                <button type="button" class="btn btn_green" data-race>Race</button>
                <button type="button" class="btn btn_blue" data-reset>Reset</button>
                <button type="button" class="btn btn_green" data-generate>Generate</button>        
            </div>
            <h1 class="heading" data-garageCount>Garage</h1>
            <h2 class="heading" data-pageCount>Page</h2>            
            <div class="garage__cars" data-garage></div>            
        </section>
        <section class="winners winners__margin hidden" data-winnersPage ></section>
        <div class="paginator">
            <button type="button" class="btn btn_blue paginator__margin disabled" data-prev>Prev</button>
            <button type="button" class="btn btn_blue" data-next>Next</button>
         </div> 
               
        <div class="message" data-message></div>`;

    const wrap: HTMLElement | null = document.querySelector('[data-root]');
    if (wrap !== undefined && wrap !== null) wrap.innerHTML = str;
  }
}

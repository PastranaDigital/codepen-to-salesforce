import { LightningElement } from 'lwc';
// import { scroll, animate } from "https://cdn.skypack.dev/motion@10.13.1"

let StackCards = function(element) {
	this.element = element;
	this.items = this.element.getElementsByClassName('js-stack-cards__item');
	this.scrollingListener = false;
	this.scrolling = false;
	this.initStackCardsEffect(this);
};

export default class StackingCards extends LightningElement {

	connectedCallback() {
		var stackCards = document.getElementsByClassName('js-stack-cards'),
		intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype),
		reducedMotion = false;
		
		if(stackCards.length > 0 && intersectionObserverSupported && !reducedMotion) { 
			for(var i = 0; i < stackCards.length; i++) {
				new StackCards(stackCards[i]);
			}
		}
		// changed to class selector instead of id
		// const cardsWrapper = document.querySelector('.cards-wrapper');
		// const cards = document.querySelectorAll('.card');

		// const numCards = cards.length;

		// cards.forEach((card, index0) => {
			
		// 	const index = index0 + 1;
		// 	const reverseIndex = numCards - index0;
		// 	const reverseIndex0 = numCards - index;

		// 	// Extra padding per card, so you can see the other stacked cards underneath at the top
		// 	card.style.paddingTop = `calc(${index} * var(--card-top-offset))`;
			
		// 	// Scroll-Linked Animation
		// 	// scroll(
		// 	// 	animate(card, {
		// 	// 		// Earlier cards shrink more than later cards
		// 	// 		scale: [ 1, 1 - (0.1 * reverseIndex0)],
		// 	// 	}), {
		// 	// 		// Each card should only shrink when it’s at the top.
		// 	// 		// We can’t use exit on the els for this (as they are sticky)
		// 	// 		// but can track cardsWrapper instead.
		// 	// 		target: cardsWrapper,
		// 	// 		offset: [`${index0 / numCards * 100}%`, `${index / numCards * 100}%`],
		// 	// 	}
		// 	// );
		// });
	}

	// https://codyhouse.co/tutorials/how-stacking-cards

	
	  
	
	
	initStackCardsEffect(element) { // use Intersection Observer to trigger animation
		var observer = new IntersectionObserver(this.stackCardsCallback.bind(element));
		observer.observe(element.element);
	}
	   
	stackCardsCallback(entries) { // Intersection Observer callback
		if(entries[0].isIntersecting) { // cards inside viewport - add scroll listener
		  if(this.scrollingListener) return; // listener for scroll event already added
		  this.stackCardsInitEvent(this);
		} else { // cards not inside viewport - remove scroll listener
		  if(!this.scrollingListener) return; // listener for scroll event already removed
		  window.removeEventListener('scroll', this.scrollingListener);
		  this.scrollingListener = false;
		}
	}
	
	stackCardsInitEvent(element) {
		element.scrollingListener = stackCardsScrolling.bind(element);
		window.addEventListener('scroll', element.scrollingListener);
	}
	
	stackCardsScrolling() {
		if(this.scrolling) return;
		this.scrolling = true;
		window.requestAnimationFrame(this.animateStackCards.bind(this));
	}
	  
	animateStackCards() {
		var top = this.element.getBoundingClientRect().top;
		
		for(var i = 0; i < this.items.length; i++) {
		// cardTop/cardHeight/marginY are the css values for the card top position/height/Y offset
		  var scrolling = this.cardTop - top - i*(this.cardHeight+this.marginY);
		  if(scrolling > 0) { // card is fixed - we can scale it down
		  this.items[i].setAttribute('style', 'transform: translateY('+this.marginY*i+'px) scale('+(this.cardHeight - scrolling*0.05)/this.cardHeight+');');
		  }
		}
	   
		this.scrolling = false;
	}
}
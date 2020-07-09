import Vue from 'vue';

const EventBus = {};
const eventArray = [];
if (!EventBus.instance) {
  EventBus.instance = new Vue();
}

EventBus.$on = (eventName, fn) => {
  if (eventArray.indexOf(eventName) === -1) {
    eventArray.push(eventName);
  }
  EventBus.instance.$on(eventName, fn);
};

EventBus.$emit = (eventName, data) => {
  EventBus.instance.$emit(eventName, data);
};

EventBus.offAll = () => {
  eventArray.forEach((item) => {
    EventBus.instance.$off(item);
  });
};
export default EventBus;

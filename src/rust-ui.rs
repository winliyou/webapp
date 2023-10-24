use wasm_bindgen::{JsCast, JsValue};
use yew::prelude::*;
struct App {
    current_random_number: u32,
    guessed_number: u32,
}

enum MyMessage {
    MsgGuessUpdate(u32),
    MsgGuessTry,
}

impl yew::Component for App {
    type Message = MyMessage;

    type Properties = ();
    fn create(ctx: &yew::Context<Self>) -> Self {
        let rand_number: u32 = rand::random::<u32>() % 1000;
        web_sys::console::log_1(&JsValue::from(format!("random: {}", rand_number)));
        App {
            current_random_number: rand_number,
            guessed_number: 0,
        }
    }
    fn view(&self, ctx: &yew::Context<Self>) -> yew::Html {
        yew::html! {
            <div>
                <input
                    type="number"
                    placeholder={"请输入0-1000中间的一个数"}
                    oninput={
                        ctx.link().callback(
                            |e: InputEvent| {
                                if let Some(target) = e.target()
                                {
                                    if let Ok(input_element) = target.dyn_into::<web_sys::HtmlInputElement>()
                                    {
                                        if let Ok(num) = input_element.value().parse::<u32>()
                                        {
                                            return MyMessage::MsgGuessUpdate(num);
                                        }
                                    }
                                }
                                MyMessage::MsgGuessUpdate(0)
                            }
                        )}
                    />
                <button name="guess"
                    onclick={
                        ctx.link().callback(
                            |_|{
                                web_sys::console::log_1(&JsValue::from("clicked")); MyMessage::MsgGuessTry
                            }
                        )}
                    >
                    {"确定"}
                    </button>
            </div>
        }
    }
    fn update(&mut self, ctx: &Context<Self>, msg: Self::Message) -> bool {
        match msg {
            MyMessage::MsgGuessTry => match self.guessed_number {
                x if (x < self.current_random_number) => {
                    web_sys::console::log_1(&JsValue::from(format!(
                        "target number: {} , guessed number: {}",
                        self.current_random_number, self.guessed_number
                    )));
                    web_sys::console::log_1(&JsValue::from("Less"));
                }
                x if (x > self.current_random_number) => {
                    web_sys::console::log_1(&JsValue::from(format!(
                        "target number: {} , guessed number: {}",
                        self.current_random_number, self.guessed_number
                    )));
                    web_sys::console::log_1(&JsValue::from("Great"));
                }
                x if (x == self.current_random_number) => {
                    web_sys::console::log_1(&JsValue::from(format!(
                        "target number: {} , guessed number: {}",
                        self.current_random_number, self.guessed_number
                    )));
                    web_sys::console::log_1(&JsValue::from("You Are Right"));
                }
                _ => {
                    web_sys::console::log_1(&JsValue::from("What's Your Problem"));
                }
            },
            MyMessage::MsgGuessUpdate(x) => {
                self.guessed_number = x;
            }
        }
        true
    }
}
fn main() {
    yew::Renderer::<App>::with_root(
        web_sys::window()
            .unwrap()
            .document()
            .unwrap()
            .get_element_by_id("app")
            .unwrap(),
    )
    .render();
}

use rand::Rng;
use wasm_bindgen::{JsCast, JsValue};
use yew::prelude::*;

struct App {
    current_random_number: u32,
    guessed_number: u32,
    first_boot: bool,
}

enum MyMessage {
    MsgGuessUpdate(u32),
    MsgGuessTry,
}

impl yew::Component for App {
    type Message = MyMessage;
    type Properties = ();

    fn create(ctx: &yew::Context<Self>) -> Self {
        let rand_number: u32 = rand::thread_rng().gen_range(0..1000);
        web_sys::console::log_1(&JsValue::from(format!("random: {}", rand_number)));
        App {
            current_random_number: rand_number,
            guessed_number: 0,
            first_boot: true,
        }
    }

    fn view(&self, ctx: &yew::Context<Self>) -> yew::Html {
        yew::html! {
        <div class="guess_input">
            <input
                id="gussing_number"
                type="text"
                placeholder={"请输入0-1000中间的一个数"}
                onchange={
                    ctx.link().callback(
                        |e: Event| {
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
        {self.render_result()}
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
                web_sys::console::log_1(&JsValue::from(format!("guess number: {}", x)));
                self.guessed_number = x;
                self.first_boot = false;
            }
        }
        true
    }
}

impl App {
    fn render_result(&self) -> yew::Html {
        yew::html!(
            if self.first_boot
            {
                <div>{"输入数字开始游戏吧~"}</div>
            }
            else
            {
                if self.guessed_number < self.current_random_number {
                    <div><h1 class="guess_result result_less">{"小了"}</h1></div>
                } else if self.guessed_number > self.current_random_number {
                    <div><h1 class="guess_result result_great">{"大了"}</h1></div>
                } else {
                    <div><h1 class="guess_result result_equal">{"对了"}</h1></div>
                }
            }
        )
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

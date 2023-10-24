use std::collections::HashMap;

use web_sys::console;
struct App {}

enum MyMessage {}

impl yew::Component for App {
    type Message = MyMessage;

    type Properties = ();
    fn create(ctx: &yew::Context<Self>) -> Self {
        App {}
    }
    fn changed(&mut self, ctx: &yew::Context<Self>, _old_props: &Self::Properties) -> bool {
        true
    }
    fn view(&self, ctx: &yew::Context<Self>) -> yew::Html {
        let mut mymap: HashMap<&str, i32> = HashMap::new();
        mymap.insert("hello", rand::random());
        mymap.insert("world", rand::random());
        mymap.insert("asdf", rand::random());
        mymap.insert("bas", rand::random());

        yew::html! {
        <div>
            {
                mymap
                .iter()
                .map(|p| {
                    yew::html! {
                        <div>
                        <h1>{p.0}</h1>
                        <h2>{p.1}</h2>
                        </div>
                    }
                })
                .collect::<yew::Html>()
            }
        </div>}
    }
    fn rendered(&mut self, ctx: &yew::Context<Self>, first_render: bool) {
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

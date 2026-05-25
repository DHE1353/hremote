use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            // Fenêtre sans barre de titre native (on utilise notre barre custom)
            window.set_decorations(false).ok();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running HRemote");
}
